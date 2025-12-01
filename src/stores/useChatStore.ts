import { create } from 'zustand';
import { Message, ChatSession } from '../types';

interface ChatState {
    messages: Message[];
    chatHistory: ChatSession[];
    currentChatId: string | null;
    isThinking: boolean;

    // Actions
    setMessages: (messages: Message[]) => void;
    addMessage: (message: Message) => void;
    setChatHistory: (history: ChatSession[]) => void;
    startNewChat: () => void;
    loadChat: (session: ChatSession) => void;
    setThinking: (thinking: boolean) => void;
    createNewChat: () => void;
    setCurrentChatId: (id: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    messages: [],
    chatHistory: [],
    currentChatId: null,
    isThinking: false,

    setMessages: (messages) => set({ messages: Array.isArray(messages) ? messages : [] }),

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    setChatHistory: (history) => set({ chatHistory: history }),

    startNewChat: () => {
        const { messages, currentChatId } = get();
        // Save current chat if exists
        if (messages.length > 0 && currentChatId) {
            // Logic to save to history would go here
        }
        set({ messages: [], currentChatId: crypto.randomUUID() });
    },

    loadChat: (session) => set({
        messages: Array.isArray(session.messages) ? session.messages : [],
        currentChatId: session.id
    }),

    setThinking: (thinking) => set({ isThinking: thinking }),

    // Aliases/Additional Actions
    createNewChat: () => get().startNewChat(),
    setCurrentChatId: (id) => set({ currentChatId: id })
}));
