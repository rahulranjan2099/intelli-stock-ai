import { useEffect, useRef } from 'react'
import { ChatIcon } from './ChatIcon'

interface Props {
  draft: string
  disabled: boolean
  pending: boolean
  conversationId: number | null
  onChange: (value: string) => void
  onSend: () => void
}

export function MessageComposer({ draft, disabled, pending, conversationId, onChange, onSend }: Props) {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [conversationId, disabled])

  return <div className="composer-area"><form className="message-composer" onSubmit={event => { event.preventDefault(); onSend() }}>
    <label className="sr-only" htmlFor="message-input">Message IntelliStock</label>
    <textarea id="message-input" ref={inputRef} rows={2} value={draft} disabled={disabled}
      placeholder={conversationId === null ? 'Create a new chat to get started…' : 'Ask IntelliStock…'}
      onChange={event => onChange(event.target.value)}
      onKeyDown={event => {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
          event.preventDefault()
          if (!disabled && !pending && draft.trim()) onSend()
        }
      }} />
    <div className="composer-actions"><span>Product, store, and timeframe — start with what you know.</span><button className="send-button" type="submit" disabled={disabled || pending || !draft.trim()}><span>{pending ? 'Thinking…' : 'Send'}</span><ChatIcon name="arrow" size={18} /></button></div>
  </form><p className="composer-hint">Enter to send · Shift + Enter for a new line</p></div>
}
