export type ChatMessage = {
  id: string;
  tableId: string;
  sender: string;
  text: string;
  timestamp: string;
};

const STORAGE_KEY = "lutho_chat_messages";

export function loadChatMessages(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveChatMessages(messages: ChatMessage[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  window.dispatchEvent(new CustomEvent("lutho_chat_updated"));
}

export function appendChatMessage(messages: ChatMessage[], message: ChatMessage): ChatMessage[] {
  const next = [...messages, message];
  saveChatMessages(next);
  return next;
}
