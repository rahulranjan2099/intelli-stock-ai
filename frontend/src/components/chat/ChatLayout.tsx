import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/useAuth'
import { useConversations } from '../../hooks/useConversations'
import { ChatIcon } from './ChatIcon'
import { ConversationSidebar } from './ConversationSidebar'
import { MessageComposer } from './MessageComposer'
import { MessageList } from './MessageList'
import './chat.css'

export default function ChatLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const chat = useConversations()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const name = user?.name || 'You'
  const noConversation = chat.activeId === null

  return <div className="chat-layout">
    <header className="app-header">
      <div className="app-brand"><button className="icon-button mobile-only" aria-label="Open conversations" aria-expanded={sidebarOpen} aria-controls="conversation-sidebar" onClick={() => setSidebarOpen(true)}><ChatIcon name="menu" /></button><span className="brand-mark"><ChatIcon name="spark" size={23} /></span><span>IntelliStock <b>AI</b></span></div>
      <div className="header-account"><span className="account-avatar">{name.slice(0, 1).toUpperCase()}</span><span className="account-name">{name}</span><button className="logout-button" onClick={() => { logout(); navigate('/login', { replace: true }) }}>Logout</button></div>
    </header>
    <div className="chat-workspace">
      <ConversationSidebar conversations={chat.conversations} activeId={chat.activeId} loading={chat.listLoading} error={chat.listError} creating={chat.creating} createError={chat.createError} open={sidebarOpen} onClose={() => setSidebarOpen(false)} onCreate={() => { void chat.createConversation(); setSidebarOpen(false) }} onSelect={id => { chat.selectConversation(id); setSidebarOpen(false) }} onRetry={() => { void chat.reloadConversations() }} />
      <main className="chat-main">
        <div className="chat-heading"><div><span className="eyebrow">YOUR INVENTORY ASSISTANT</span><h1>{chat.activeConversation?.title ?? 'Let’s plan ahead'}</h1></div><span className="assistant-label"><span /> IntelliStock AI</span></div>
        <div className="chat-scroll">
          {chat.thread.loading ? <div className="chat-state" role="status"><span className="loading-spinner" />Loading messages…</div>
            : chat.thread.messages.length > 0 ? <MessageList messages={chat.thread.messages} pending={chat.thread.pending} userName={name} />
            : !chat.thread.error && <div className="chat-welcome"><div className="welcome-mark"><ChatIcon name="spark" size={32} /></div><span className="eyebrow">A LITTLE CLARITY. A BETTER PLAN.</span><h2>What’s next for your inventory?</h2><p>Turn your questions into demand forecasts.<br />Tell me the product, store, and how far ahead to look.</p>
              {noConversation ? <button className="primary-button" onClick={() => { void chat.createConversation() }} disabled={chat.creating || chat.listLoading}><ChatIcon name="plus" size={18} />{chat.creating ? 'Creating chat…' : 'Start a conversation'}</button>
                : <div className="suggestion-grid">{['Forecast Curd for S010 for 3 months', 'Forecast Milk for S010 for 6 months'].map(prompt => <button key={prompt} onClick={() => chat.setDraft(prompt)}><ChatIcon name="chart" /><span>{prompt}</span><span aria-hidden="true">↗</span></button>)}</div>}
            </div>}
          {(chat.thread.error || chat.thread.sendError) && <div className="chat-error" role="alert"><p>{chat.thread.error || chat.thread.sendError}</p><button className="text-button" onClick={chat.reloadMessages} disabled={chat.thread.loading || chat.thread.pending}>Reload messages</button></div>}
          {chat.createError && !sidebarOpen && <p className="chat-error" role="alert">{chat.createError}</p>}
        </div>
        <MessageComposer draft={chat.draft} onChange={chat.setDraft} onSend={() => { void chat.sendMessage() }} conversationId={chat.activeId} disabled={noConversation || chat.thread.loading || !!chat.thread.error} pending={chat.thread.pending} />
      </main>
    </div>
  </div>
}
