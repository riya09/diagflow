<template>
  <main>
    <div class="diag-flow-container">
      <div class="input-section">
        <TextInputComponent
          v-model="naturalLanguageInput"
          :is-loading="isLoading"
          @convert="convertTextToBlockDiag"
          @set-current-history="updateChatHistory"
        />
      </div>
      <div class="editor-section">
        <DiagramRenderer
          :key="store.currentChatIndex"
          :error-message="errorMessage"
          :blockDiagCode="blockDiagCode"
          :is-loading="isLoading"
        />
      </div>
    </div>
  </main>
</template>

<script setup>
import TextInputComponent from './TextInputComponent.vue'
import DiagramRenderer from './DiagramRenderer.vue'
import { useChatHistoryStore } from '@/stores/chatHistory'
import { onMounted, ref } from 'vue'
import { convertNLToBlockDiag } from '@/services/openRouterService'

const naturalLanguageInput = ref('')
const blockDiagCode = ref('')
const errorMessage = ref('')
const store = useChatHistoryStore()
const isLoading = ref(false)

const convertTextToBlockDiag = async (text) => {
  isLoading.value = true
  errorMessage.value = ''
  if (!text.trim()) {
    errorMessage.value = 'Please enter a description for your diagram'
    return
  }
  const code = await convertNLToBlockDiag(text)
  if (code.result) {
    blockDiagCode.value = code.result
    if (text.trim() === store.chatHistory[store.currentChatIndex].prompt) {
      store.updateChat(store.currentChatIndex, {
        prompt: text,
        blockDiagCode: code.result,
      })
    } else {
      store.addChat({
        prompt: text,
        blockDiagCode: blockDiagCode.value,
      })
    }
  } else {
    errorMessage.value = code.error || 'An error occurred while converting the text'
  }
  isLoading.value = false
}

const updateChatHistory = (increment) => {
  store.setCurrentChatIndex(store.currentChatIndex + increment)
  const currentChat = store.chatHistory[store.currentChatIndex]
  naturalLanguageInput.value = currentChat.prompt
  blockDiagCode.value = currentChat.blockDiagCode
}

onMounted(() => {
  const currentChat = store.chatHistory[store.currentChatIndex]
  if (currentChat) {
    updateChatHistory(store.currentChatIndex)
  }
})
</script>

<style lang="scss" scoped>
.diag-flow-container {
  display: flex;
  flex-direction: column;
  padding-right: 5px;
  .input-section {
    width: 100%;
    height: 100%;
  }
}


@media (min-width: 768px) {
  .diag-flow-container {
    flex-direction: row;
    .input-section {
      width: 35%;
    }
    .editor-section {
      width: 65%;
    }
  }
}
</style>
