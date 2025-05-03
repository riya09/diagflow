<template>
  <div class="chatbox-wrapper">
    <div class="chat-count">
      <button
        class="arrows"
        @click="$emit('setCurrentHistory', -1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-arrow-left"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 5 5 12 12 19"></polyline>
        </svg>
      </button>
      <span>{{ (store.currentChatIndex + 1) }} / {{ store.chatHistory.length || 1 }}</span>
      <button
        class="arrows"
        @click="$emit('setCurrentHistory', 1)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-arrow-right"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 19 19 12 12 5"></polyline>
        </svg>
      </button>
    </div>
    <div
      v-if="store.chatHistory.length === 1"
      class="instruction">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="24" height="24">
        <path fill="#000" d="M272 384c9.6-31.9 29.5-59.1 49.2-86.2c0 0 0 0 0 0c5.2-7.1 10.4-14.2 15.4-21.4c19.8-28.5 31.4-63
        31.4-100.3C368 78.8 289.2 0 192 0S16 78.8 16 176c0 37.3 11.6 71.9 31.4 100.3c5 7.2 10.2
        14.3 15.4 21.4c0 0 0 0 0 0c19.8 27.1 39.7 54.4 49.2 86.2l160 0zM192 512c44.2 0 80-35.8
        80-80l0-16-160 0 0 16c0 44.2 35.8 80 80 80zM112 176c0 8.8-7.2 16-16 16s-16-7.2-16-16c0-61.9
        50.1-112 112-112c8.8 0 16 7.2 16 16s-7.2 16-16 16c-44.2 0-80 35.8-80 80z"/>
      </svg>
      <p>
        Write your text here. You can use the buttons to navigate through the chat history. Here is
        an example of description of the text you can write.
      </p>
    </div>
    <textarea
      v-model="inputText"
      class="text-input"
    />
    <button
      class="generate-btn"
      :disabled="isLoading"
      @click="sendText"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-send"
      >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useChatHistoryStore } from '@/stores/chatHistory'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['convert', 'setCurrentHistory'])

const inputText = ref(props.modelValue)
const store = useChatHistoryStore()
const sendText = () => {
  emit('convert', inputText.value)
}
watch(() => props.modelValue, (newValue) => {
  inputText.value = newValue
})
</script>

<style lang="scss" scoped>
.chatbox-wrapper {
  width: 100%;
  height: 92dvh;
  min-height: 600px;
  background-color: #fff;
  font-family: 'Poppins', sans-serif;
  position: relative;
  .instruction {
    padding: 0.5rem;
    font-size: 12px;
    color: #3d3c3cee;
    background: #fdf59b;
    border-radius: 0.5rem;
    margin: 0.5rem;
    display: flex;
    gap: 8px;
    align-items: flex-start;
    p {
      margin: 0;
      line-height: 20px;
    }
  }
  .chat-count {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: #5273ce;
    background: #ffffff;
    border-bottom: 1px solid #e3e1e1;
    .arrows {
      background: transparent;
      border: 1px solid #5273ce;
      border-radius: 2rem;
      display: grid;
      place-items: center;
      cursor: pointer;
      svg {
        width: 1.2rem;
        height: 1.2rem;
        color: #5273ce;
      }
    }
    span {
      display: inline-block;
      width: 80px;
      text-align: center;
    }
  }
  textarea {
    width: 100%;
    height: calc(100% - 60px);
    border: none;
    resize: none;
    outline: none;
    background: transparent;
    padding: 1rem;
    overflow: auto;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
    font-weight: normal;
    font-size: 0.85rem;
    line-height: 26px;
    color: #3d3c3cee;
  }
  .generate-btn {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    border-radius: 3rem;
    border: none;
    background: #638af8;
    color: #fff;
    cursor: pointer;
    padding: 0.5rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
    display: grid;
    place-items: center;
    transition: transform 0.25s ease-in-out;
    &:hover {
      transform: translate(0, -5px);
      background: #4565c0;
    }
    &:disabled {
      background: #94b0ff;
      cursor: not-allowed;
      transform: translate(0, 0);
    }
  }
}
</style>
