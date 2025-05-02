import { defineStore } from 'pinia'

export const useChatHistoryStore = defineStore('chatHistory', {
  state: () => ({
    chatHistory: [],
    currentChatIndex: 0,
  }),
  actions: {
    addChat(chat) {
      this.chatHistory.push(chat)
      this.currentChatIndex = this.chatHistory.length - 1
    },
    clearChat() {
      this.chatHistory = []
      this.currentChatIndex = 0
    },
    setCurrentChatIndex(index) {
      if (index >= 0 && index < this.chatHistory.length) {
        this.currentChatIndex = index
      }
    },
  },
  persist: true,
})
