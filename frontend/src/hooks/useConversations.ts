import { useCallback, useEffect, useRef, useState } from 'react'
import { conversationsApi } from '../api/conversations'
import type { ChatMessage, Conversation } from '../api/conversations'

interface Thread {
  messages: ChatMessage[]
  loading: boolean
  pending: boolean
  error: string
  sendError: string
}

const emptyThread: Thread = { messages: [], loading: false, pending: false, error: '', sendError: '' }

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<number | null>(null)
  const [threads, setThreads] = useState<Record<number, Thread>>({})
  const [drafts, setDrafts] = useState<Record<number, string>>({})
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const pending = useRef(new Set<number>())
  const creatingRef = useRef(false)
  const versions = useRef<Record<number, number>>({})
  const listVersion = useRef(0)
  const activeIdRef = useRef<number | null>(null)

  const updateThread = useCallback((id: number, update: Partial<Thread>) => {
    setThreads(current => ({ ...current, [id]: { ...(current[id] ?? emptyThread), ...update } }))
  }, [])

  const loadMessages = useCallback(async (id: number) => {
    if (pending.current.has(id)) return
    const version = (versions.current[id] ?? 0) + 1
    versions.current[id] = version
    updateThread(id, { loading: true, error: '' })
    try {
      const messages = await conversationsApi.messages(id)
      if (versions.current[id] === version) updateThread(id, { messages, loading: false, sendError: '' })
    } catch {
      if (versions.current[id] === version) {
        updateThread(id, { loading: false, error: 'Could not load this conversation. Please try again.' })
      }
    }
  }, [updateThread])

  const loadConversations = useCallback((signal?: AbortSignal) => {
    const version = ++listVersion.current
    return conversationsApi.list(signal).then(items => {
      if (signal?.aborted || version !== listVersion.current) return
      setConversations(items)
      if (activeIdRef.current === null && items[0]) {
        activeIdRef.current = items[0].id
        setActiveId(items[0].id)
        void loadMessages(items[0].id)
      }
    }).catch(() => {
      if (!signal?.aborted && version === listVersion.current) setListError('Could not load conversations.')
    }).finally(() => {
      if (!signal?.aborted && version === listVersion.current) setListLoading(false)
    })
  }, [loadMessages])

  useEffect(() => {
    const controller = new AbortController()
    void loadConversations(controller.signal)
    return () => controller.abort()
  }, [loadConversations])

  function selectConversation(id: number) {
    activeIdRef.current = id
    setActiveId(id)
    void loadMessages(id)
  }

  async function createConversation() {
    if (creatingRef.current || listLoading) return
    creatingRef.current = true
    setCreating(true)
    setCreateError('')
    try {
      const conversation = await conversationsApi.create()
      setConversations(current => [conversation, ...current])
      updateThread(conversation.id, emptyThread)
      activeIdRef.current = conversation.id
      setActiveId(conversation.id)
    } catch {
      setCreateError('Could not create a chat. Please try again.')
    } finally {
      creatingRef.current = false
      setCreating(false)
    }
  }

  async function sendMessage() {
    const id = activeId
    if (id === null || pending.current.has(id)) return
    const thread = threads[id]
    const content = (drafts[id] ?? '').trim()
    if (!content || !thread || thread.loading || thread.error) return
    pending.current.add(id)
    versions.current[id] = (versions.current[id] ?? 0) + 1
    const optimistic: ChatMessage = {
      id: `pending-${id}`, conversationId: id, role: 'USER', content,
      createdAt: new Date().toISOString(), optimistic: true,
    }
    updateThread(id, { messages: [...thread.messages, optimistic], pending: true, sendError: '' })
    setDrafts(current => ({ ...current, [id]: '' }))
    try {
      const response = await conversationsApi.send(id, content)
      updateThread(id, {
        messages: [...thread.messages, response.userMessage, {
          ...response.assistantMessage, type: response.type, data: response.data,
        }],
        pending: false,
      })
      setConversations(current => {
        const original = current.find(item => item.id === id)
        if (!original) return current
        const updated = response.conversation ?? {
          ...original,
          title: thread.messages.length ? original.title : content.slice(0, 80),
          updatedAt: new Date().toISOString(),
        }
        return [updated, ...current.filter(item => item.id !== id)]
      })
    } catch {
      // The API saves the user message before asking the assistant. Read it back
      // before offering another send, so a failed response isn't silently duplicated.
      try {
        const messages = await conversationsApi.messages(id)
        const previousIds = new Set(thread.messages.map(message => message.id))
        const saved = messages.some(message => !previousIds.has(message.id) && message.role === 'USER' && message.content === content)
        updateThread(id, {
          messages, pending: false,
          sendError: saved
            ? 'Your message was saved, but the assistant response could not be confirmed. Reload messages to check, or send a follow-up.'
            : 'Your message was not saved. You can try sending it again.',
        })
        if (!saved) setDrafts(current => ({ ...current, [id]: current[id] || content }))
      } catch {
        updateThread(id, {
          messages: thread.messages, pending: false,
          error: 'Could not confirm whether your message was saved. Reload messages before sending again.',
        })
        setDrafts(current => ({ ...current, [id]: current[id] || content }))
      }
    } finally {
      pending.current.delete(id)
    }
  }

  return {
    conversations, activeId, selectConversation,
    activeConversation: conversations.find(item => item.id === activeId),
    thread: activeId === null ? emptyThread : threads[activeId] ?? { ...emptyThread, loading: true },
    draft: activeId === null ? '' : drafts[activeId] ?? '',
    setDraft: (value: string) => { if (activeId !== null) setDrafts(current => ({ ...current, [activeId]: value })) },
    listLoading, listError, creating, createError, createConversation, sendMessage,
    reloadConversations: () => {
      setListLoading(true)
      setListError('')
      return loadConversations()
    },
    reloadMessages: () => { if (activeId !== null) void loadMessages(activeId) },
  }
}
