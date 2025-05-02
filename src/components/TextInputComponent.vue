<template>
  <div class="chatbox-wrapper">
    <div class="chat-count">
      <button class="arrows">
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
      <span>1/1</span>
      <button class="arrows">
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
import { ref } from 'vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['convert'])

const inputText = ref(props.modelValue)
const sendText = () => {
  emit('convert', inputText.value)
}
</script>

<style lang="scss" scoped>
.chatbox-wrapper {
  width: 100%;
  height: 100dvh;
  min-height: 600px;
  background-color: #fff;
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  .chat-count {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    color: #fdfdfd;
    background: #638af8;
    .arrows {
      background: transparent;
      border: none;
      display: grid;
      place-items: center;
      cursor: pointer;
      svg {
        width: 1.2rem;
        height: 1.2rem;
        color: #fff;
      }
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
    font-family: Arial, 'sans-serif';
    font-weight: normal;
    font-size: 1rem;
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
  }
}
</style>
