import { useEffect, useRef } from 'react'
import type { ChatMessage } from '../../api/conversations'
import { ChatIcon } from './ChatIcon'
import { ForecastCard } from './ForecastCard'

export function MessageList({ messages, pending, userName }: { messages: ChatMessage[]; pending: boolean; userName: string }) {
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' }) }, [messages, pending])

  return <div className="message-list" role="log" aria-label="Messages" aria-live="polite" aria-relevant="additions text">
    {messages.map(message => <article key={message.id} className={`message message-${message.role.toLowerCase()}`}>
      <div className={`message-avatar ${message.role === 'ASSISTANT' ? 'assistant-avatar' : ''}`}>{message.role === 'ASSISTANT' ? <ChatIcon name="spark" size={18} /> : userName.slice(0, 1).toUpperCase()}</div>
      <div className="message-body">
        <div className="message-meta"><strong>{message.role === 'ASSISTANT' ? 'IntelliStock' : 'You'}</strong><time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</time>{message.optimistic && <span>Sending…</span>}</div>
        <div className="message-bubble"><p>{message.content}</p></div>
        {message.role === 'ASSISTANT' && message.type === 'forecast' && <ForecastCard data={message.data} />}
      </div>
    </article>)}
    {pending && <div className="message message-assistant" role="status"><div className="message-avatar assistant-avatar"><ChatIcon name="spark" size={18} /></div><div className="assistant-loading"><strong>IntelliStock is thinking</strong><span className="thinking-dots" aria-hidden="true"><i /><i /><i /></span></div></div>}
    <div ref={endRef} />
  </div>
}
