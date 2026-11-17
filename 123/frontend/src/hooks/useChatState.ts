import { createContext, useContext, type Dispatch, type SetStateAction } from 'react'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }
export type ChatHistory = Record<string, ChatMessage[]>
export type ChatDrafts = Record<string, string>
type SharedChatState = {
  history: ChatHistory
  setHistory: Dispatch<SetStateAction<ChatHistory>>
  drafts: ChatDrafts
  setDrafts: Dispatch<SetStateAction<ChatDrafts>>
}
export const ChatStateContext = createContext<SharedChatState | null>(null)

export function useChatState() {
  const state = useContext(ChatStateContext)
  if (!state) throw new Error('AIChatPanel must be inside ChatStateContext.Provider')
  return state
}
