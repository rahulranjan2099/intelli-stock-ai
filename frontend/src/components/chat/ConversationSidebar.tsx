import type { Conversation } from '../../api/conversations'
import { ChatIcon } from './ChatIcon'

interface Props {
  conversations: Conversation[]
  activeId: number | null
  loading: boolean
  error: string
  creating: boolean
  createError: string
  open: boolean
  onClose: () => void
  onCreate: () => void
  onSelect: (id: number) => void
  onRetry: () => void
}

export function ConversationSidebar(props: Props) {
  return <>
    {props.open && <button className="sidebar-backdrop" aria-label="Close conversations" onClick={props.onClose} />}
    <aside id="conversation-sidebar" className={`conversation-sidebar ${props.open ? 'is-open' : ''}`} aria-label="Conversations">
      <div className="sidebar-heading"><span>WORKSPACE</span><button className="icon-button mobile-only" onClick={props.onClose} aria-label="Close conversations"><ChatIcon name="close" /></button></div>
      <button className="new-chat-button" onClick={props.onCreate} disabled={props.creating || props.loading}>
        <ChatIcon name="plus" />{props.creating ? 'Creating chat…' : 'New chat'}
      </button>
      {props.createError && <p className="sidebar-error" role="alert">{props.createError}</p>}
      <div className="sidebar-label"><h2>Conversations</h2><span>{props.conversations.length}</span></div>
      <nav className="conversation-list" aria-label="Conversation history">
        {props.loading && <p className="sidebar-note" role="status">Loading conversations…</p>}
        {props.error && <div className="sidebar-error" role="alert"><p>{props.error}</p><button className="text-button" onClick={props.onRetry}>Try again</button></div>}
        {!props.loading && !props.error && props.conversations.length === 0 && <p className="sidebar-note">Your conversations will appear here. Start a new chat to get going.</p>}
        {props.conversations.map(conversation => <button
          key={conversation.id}
          className={`conversation-item ${props.activeId === conversation.id ? 'is-active' : ''}`}
          aria-current={props.activeId === conversation.id ? 'page' : undefined}
          onClick={() => props.onSelect(conversation.id)}
          title={conversation.title}
        >
          <ChatIcon name="chat" size={18} />
          <span><strong>{conversation.title}</strong><small>Chat #{conversation.id} · {new Date(conversation.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</small></span>
        </button>)}
      </nav>
      <div className="sidebar-footer"><ChatIcon name="chart" /><div><strong>A clearer view of demand</strong><p>Plan your inventory with confidence.</p></div></div>
    </aside>
  </>
}
