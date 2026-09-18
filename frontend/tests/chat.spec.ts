import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const date = '2026-09-18T10:00:00.000Z'
const conversation = (id: number, title: string) => ({ id, title, createdAt: date, updatedAt: date })
const message = (id: number, conversationId: number, role: string, content: string) => ({ id, conversationId, role, content, createdAt: date })
const forecast = {
  model_name: 'demand_model', model_version: 'v1',
  forecast_start: '2026-10-01', forecast_end: '2026-12-01',
  forecast: [
    { year_month: '2026-10-01', predicted_demand: 120 },
    { year_month: '2026-11-01', predicted_demand: 150 },
    { year_month: '2026-12-01', predicted_demand: 180 },
  ],
}

async function mockApi(page: Page, options: { empty?: boolean; failedSend?: 'saved' | 'unsaved'; failedList?: boolean; failedMessages?: boolean } = {}) {
  const conversations = options.empty ? [] : [conversation(1, 'Forecast Curd'), conversation(2, 'Milk forecast')]
  const messages: Record<number, unknown[]> = {
    1: [message(11, 1, 'USER', 'Forecast Curd for S010'), message(12, 1, 'ASSISTANT', 'For how many months would you like the forecast?')],
    2: [message(21, 2, 'ASSISTANT', 'Let’s look at Milk.')],
  }
  const sends: string[] = []
  let failList = options.failedList
  let failMessages = options.failedMessages
  await page.addInitScript(() => localStorage.setItem('accessToken', 'test-token'))
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname
    const method = route.request().method()
    if (path === '/api/auth/me') return route.fulfill({ json: { user: { id: 1, name: 'Rahul', email: 'rahul@example.com' } } })
    if (path === '/api/conversations') {
      if (method === 'POST') {
        const created = conversation(3, 'New Conversation')
        conversations.unshift(created)
        messages[3] = []
        return route.fulfill({ status: 201, json: { conversation: created } })
      }
      if (failList) { failList = false; return route.fulfill({ status: 500, json: {} }) }
      return route.fulfill({ json: { conversations } })
    }
    const id = Number(path.match(/conversations\/(\d+)\/messages/)?.[1])
    if (id && method === 'GET') {
      if (failMessages) { failMessages = false; return route.fulfill({ status: 500, json: {} }) }
      return route.fulfill({ json: { messages: messages[id] ?? [] } })
    }
    if (id && method === 'POST') {
      const content = route.request().postDataJSON().content
      sends.push(content)
      const userMessage = message(100 + sends.length * 2, id, 'USER', content)
      if (options.failedSend !== 'unsaved') messages[id].push(userMessage)
      await new Promise(resolve => setTimeout(resolve, 500))
      if (options.failedSend) return route.fulfill({ status: 500, json: {} })
      const assistantMessage = { ...message(101 + sends.length * 2, id, 'ASSISTANT', 'Here is your forecast.'), type: 'forecast', data: forecast }
      messages[id].push(assistantMessage)
      const updated = conversations.find(item => item.id === id)!
      if (updated.title === 'New Conversation') updated.title = content
      return route.fulfill({ status: 201, json: { userMessage, assistantMessage, conversation: updated, type: 'forecast', data: forecast } })
    }
    return route.fulfill({ status: 404, json: {} })
  })
  return { sends }
}

test('loads history, switches conversations, and keeps separate drafts', async ({ page }) => {
  await mockApi(page)
  await page.goto('/dashboard')
  await expect(page.getByText('For how many months would you like the forecast?')).toBeVisible()
  await page.getByLabel('Message IntelliStock').fill('Three months')
  await page.getByRole('button', { name: /Milk forecast/ }).click()
  await expect(page.getByText('Let’s look at Milk.')).toBeVisible()
  await expect(page.getByLabel('Message IntelliStock')).toHaveValue('')
  await page.getByRole('button', { name: /Forecast Curd/ }).click()
  await expect(page.getByLabel('Message IntelliStock')).toHaveValue('Three months')
})

test('creates a conversation, sends optimistically, and restores forecast data after reload', async ({ page }) => {
  const { sends } = await mockApi(page, { empty: true })
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Start a conversation' }).click()
  const input = page.getByLabel('Message IntelliStock')
  await input.fill('Forecast Curd for S010 for 3 months')
  await input.press('Enter')
  await expect(page.getByText('IntelliStock is thinking')).toBeVisible()
  await expect(page.getByText('Sending…', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Thinking…' })).toBeDisabled()
  await expect(page.getByRole('region', { name: 'Demand forecast' })).toBeVisible()
  await expect(page.getByText('450 units')).toBeVisible()
  expect(sends).toEqual(['Forecast Curd for S010 for 3 months'])
  await page.reload()
  await expect(page.getByRole('region', { name: 'Demand forecast' })).toBeVisible()
  await expect(page.getByText('450 units')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Forecast Curd for S010 for 3 months')
})

test('keeps an in-flight assistant response in its original conversation', async ({ page }) => {
  await mockApi(page)
  await page.goto('/dashboard')
  await page.getByLabel('Message IntelliStock').fill('3 months')
  await page.getByRole('button', { name: 'Send', exact: true }).click()
  await page.getByRole('button', { name: /Milk forecast/ }).click()
  await expect(page.getByText('Let’s look at Milk.')).toBeVisible()
  await expect(page.getByText('IntelliStock is thinking')).not.toBeVisible()
  await expect(page.getByText('Here is your forecast.')).not.toBeVisible()
  await page.getByRole('button', { name: /Forecast Curd/ }).click()
  await expect(page.getByText('Here is your forecast.')).toBeVisible()
})

test('recovers a saved user message after an assistant failure without resending it', async ({ page }) => {
  const { sends } = await mockApi(page, { failedSend: 'saved' })
  await page.goto('/dashboard')
  await page.getByLabel('Message IntelliStock').fill('3 months')
  await page.getByLabel('Message IntelliStock').press('Enter')
  await expect(page.getByRole('alert')).toContainText('Your message was saved')
  await expect(page.getByText('3 months', { exact: true })).toHaveCount(1)
  await expect(page.getByLabel('Message IntelliStock')).toHaveValue('')
  expect(sends).toHaveLength(1)
})

test('restores the draft when a failed send did not save the message', async ({ page }) => {
  await mockApi(page, { failedSend: 'unsaved' })
  await page.goto('/dashboard')
  await page.getByLabel('Message IntelliStock').fill('3 months')
  await page.getByLabel('Message IntelliStock').press('Enter')
  await expect(page.getByRole('alert')).toContainText('Your message was not saved')
  await expect(page.getByLabel('Message IntelliStock')).toHaveValue('3 months')
  await expect(page.getByText('Sending…', { exact: true })).not.toBeVisible()
})

test('can retry conversation and history loading failures', async ({ page }) => {
  await mockApi(page, { failedList: true, failedMessages: true })
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('alert')).toContainText('Could not load this conversation')
  await expect(page.getByLabel('Message IntelliStock')).toBeDisabled()
  await page.getByRole('button', { name: 'Reload messages' }).click()
  await expect(page.getByText('For how many months would you like the forecast?')).toBeVisible()
  await expect(page.getByLabel('Message IntelliStock')).toBeEnabled()
})

test('supports multiline drafts and blocks empty sends', async ({ page }) => {
  const { sends } = await mockApi(page)
  await page.goto('/dashboard')
  const input = page.getByLabel('Message IntelliStock')
  await expect(input).toBeEnabled()
  await expect(page.getByRole('button', { name: 'Send', exact: true })).toBeDisabled()
  await input.fill('Forecast')
  await input.press('Shift+Enter')
  await input.press('C')
  await expect(input).toHaveValue('Forecast\nC')
  expect(sends).toHaveLength(0)
})

test('mobile sidebar selects a chat and the forecast stays within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await mockApi(page)
  await page.goto('/dashboard')
  await page.getByRole('button', { name: 'Open conversations' }).click()
  await page.getByRole('button', { name: /Milk forecast/ }).click()
  await expect(page.getByRole('complementary', { name: 'Conversations' })).not.toBeVisible()
  await page.getByLabel('Message IntelliStock').fill('Forecast for 3 months')
  await page.getByLabel('Message IntelliStock').press('Enter')
  await expect(page.getByRole('region', { name: 'Demand forecast' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/chat-mobile.png', fullPage: true })
})
