<template>
  <div class="toolbar">
    <div class="options">
      <svg width="20" height="20" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="25" cy="25" r="25" fill="#000"/>
      </svg>
      <svg width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.264 15.2254L12.392 10.6545H6.032L4.184 15.2254H2L8.24 0.395996H10.256L16.472
          15.2254H14.264ZM9.992 4.5325C9.96 4.42219 9.888 4.22226 9.776 3.93271C9.68 3.64315
          9.576 3.3467 9.464 3.04336C9.368 2.72623 9.288 2.48493 9.224 2.31947C9.144 2.59524
          9.056 2.8779 8.96 3.16745C8.88 3.44322 8.8 3.6983 8.72 3.93271C8.64 4.16711 8.568
          4.36704 8.504 4.5325L6.728 8.99992H11.768L9.992 4.5325Z"
          fill="#0C0C0C"/>
        <rect y="16.9489" width="20" height="3.44709" fill="#212020"/>
      </svg>
      <div class="style-popover">
        <div class="property">
          <span>Fill</span>
          <label for="fill-color">
            <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10" height="10" rx="1" :fill="nodeStyle.fill"/>
            </svg>
            <input
              v-model="nodeStyle.fill"
              id="fill-color"
              class="color-picker"
              type="color"
              @input="setNodeStyle(nodeStyle.fill, 'fill')"
            >
          </label>
        </div>
        <div class="property">
          <span>Stroke</span>
          <label for="stroke-color">
            <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10" height="10" rx="1" :fill="nodeStyle.stroke"/>
            </svg>
            <input
              v-model="nodeStyle.stroke"
              id="stroke-color"
              class="color-picker"
              type="color"
              @input="setNodeStyle(nodeStyle.stroke, 'stroke')"
            >
          </label>
        </div>
        <div class="property">
          <span>Stroke-width</span>
          <label for="stroke-width">
            <input
              v-model="nodeStyle.strokeWidth"
              id="stroke-width"
              class="text-input"
              type="number"
              min="1"
              max="5"
              @input="setNodeStyle(nodeStyle.strokeWidth, 'stroke-width')"
            >
          </label>
        </div>
        <div class="property">
          <span>Dashed</span>
          <label for="stroke-dashed">
            <input
              v-model="nodeStyle.dashed"
              id="stroke-dashed"
              type="checkbox"
              @change="setDashedStroke"
            >
          </label>
        </div>
        <div class="property">
          <span>Font-size</span>
          <label for="stroke-width">
            <input
              v-model="nodeStyle.fontSize"
              id="stroke-width"
              class="text-input"
              type="number"
              min="8"
              max="20"
              @input="setTextStyle(`${nodeStyle.fontSize}px`, 'font-size')"
            >
            <span>px</span>
          </label>
        </div>
        <div class="property">
          <span>Color</span>
          <label for="font-color">
            <svg width="15" height="15" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10" height="10" rx="1" :fill="nodeStyle.fontColor"/>
            </svg>
            <input
              v-model="nodeStyle.fontColor"
              id="font-color"
              class="color-picker"
              type="color"
              @input="setTextStyle(nodeStyle.fontColor, 'fill')"
            >
          </label>
        </div>
        <div class="property">
          <span>Text</span>
          <textarea
            v-model="nodeStyle.text"
            class="text-input"
            rows="2"
            @input="setTextStyle(nodeStyle.text, 'text')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  selectionType: {
    type: String,
    default: null
  },
  node: {
    type: Object,
    default: null
  },
})

const emit = defineEmits(['updateNodeStyle', 'updateTextStyle'])
const nodeStyle = ref({
  fill: '#000000',
  stroke: '#000000',
  strokeWidth: 1,
  fontColor: '#000000',
  fontSize: 14,
  text: ''
})
const setNodeStyle = (color, type) => {
  emit('updateNodeStyle', { color, type })
}
const setTextStyle = (color, type) => {
  emit('updateTextStyle', { color, type })
}
const setDashedStroke = () => {
  const isChecked = nodeStyle.value.dashed
  setNodeStyle(isChecked ? '3' : null, 'stroke-dasharray')
  setNodeStyle(isChecked ? 'round' : null, 'stroke-linecap')
}
const setInitialStyle = (newNode) => {
  if (newNode) {
      const node = newNode.selectAll('polygon, ellipse, path')
      const textNode = newNode.selectAll('text')
      nodeStyle.value = {
        fill: node.attr('fill') || '#000000',
        stroke: node.attr('stroke') || '#000000',
        strokeWidth: node.attr('stroke-width') || 1,
        dashed: !!node.attr('stroke-dasharray'),
        ...(
          props.selectionType === 'node'
            ? {
                fontColor: textNode.attr('font-color') || '#000000',
                fontSize: Number(textNode.attr('font-size').replace('px', '')) || 14,
                text: textNode.text().trim() || '',
              }
            : null
        )
      }
    }
}
watch(
  () => props.node,
  (newNode) => {
    setInitialStyle(newNode)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.toolbar {
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
  max-width: fit-content;
  position: fixed;
  right: 12px;
  top: 10px;
  .options {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    position: relative;
    .style-popover {
      position: absolute;
      top: 40px;
      left: -80px;
      width: 100%;
      height: 100%;
      min-width: 130px;
      min-height: 140px;
      background-color: #ffffff;
      padding: 0.25rem;
      border-radius: 0.25rem;
      border: 1px solid #ccc;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      .property {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 0.25rem;
        border-bottom: 1px solid #ccc;
        padding: 0.25rem 0;
        span {
          font-size: 0.75rem;
          color: #000;
        }
      }
    }
    .color-picker {
      visibility: hidden;
      opacity: 0;
      width: 0;
      height: 0;
      padding: 0;
      margin: 0;
      border: none;
    }
  }
}

</style>
