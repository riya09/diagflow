<template>
  <div class="diagram-renderer">
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div>Rendering diagram...</div>
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <toolbar
      v-if="selectedNode || selectedEdge"
      :selection-type="selectedNode ? 'node' : 'edge'"
      :node="selectedNode || selectedEdge"
      @update-text-style="updateTextStyle"
      @update-node-style="updateNodeStyle"
    />
    <div class="diagram-container" ref="diagramContainer">
      <!-- GraphViz -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
import 'd3-graphviz'
import Toolbar from './ToolBar.vue'

const props = defineProps({
  blockdiagCode: {
    type: String,
    default: null
  }
})

const selectedNode = ref(null)
const selectedEdge = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const configGraph = () => {
  const nodes = d3.selectAll('.node')
  const edges = d3.selectAll('.edge')
  nodes.selectAll('polygon, ellipse').attr("fill", "white")

  nodes.on('click mousedown', (event) => {
    event.preventDefault()
    event.stopPropagation()
    selectedNode.value = d3.select(event.currentTarget)
    selectedEdge.value = null
    highlightSelectedNode(event.currentTarget)
  })

  nodes.on('mousemove', function () {
    if (selectedNode.value) {
      const bbox = d3.select(this).node().getBBox()
      const x = bbox.x
      const y = bbox.y
    }
  })

  edges.on("click mousedown", (event) => {
    event.preventDefault()
    event.stopPropagation()
    selectedEdge.value = d3.select(event.currentTarget)
    selectedNode.value = null
    highlightSelectedNode(event.currentTarget)
  })
}

const renderDiagram = async (code) => {
  if (code) {
    isLoading.value = true
    errorMessage.value = ''
    const width = document.querySelector('.diagram-container').offsetWidth
    const height = document.querySelector('.diagram-container').offsetHeight

    const diagram = code.replace(/\n/g, ' ')
    await d3.select('.diagram-container')
      .graphviz()
      .fit(true)
      .width(width)
      .height(height)
      .renderDot(diagram)
      .on('end', () => {
        isLoading.value = false
        configGraph()
      })
      .onerror(err => console.error('Graphviz layout error:', err))
  }
}

const highlightSelectedNode = (element) => {
  const boundedBox = document.getElementById('boundary')
  if (boundedBox) {
    boundedBox.remove()
  }
  const bbox = d3.select(element).node().getBBox()
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('x', bbox.x)
  rect.setAttribute('y', bbox.y)
  rect.setAttribute('width', bbox.width)
  rect.setAttribute('height', bbox.height)
  rect.setAttribute('fill', 'none')
  rect.setAttribute('stroke', 'blue')
  rect.setAttribute('id', 'boundary')
  element.insertBefore(rect, element.firstChild)
}

const updateTextStyle = (style) => {
  if (style.type === 'text') {
    selectedNode.value.selectAll('text').text(style.color)
  } else {
    selectedNode.value.selectAll('text').attr(style.type, style.color)
  }
}
const updateNodeStyle = (style) => {
  if (selectedNode.value) {
    selectedNode.value.selectAll('polygon, ellipse').attr(style.type, style.color)
  }
  if (selectedEdge.value) {
    selectedEdge.value.selectAll('path, polygon').attr(style.type, style.color)
  }
}

onMounted(() => {
  renderDiagram(props.blockdiagCode)
})

watch(() => props.blockdiagCode, (newValue) => {
  if (newValue) {
    renderDiagram(newValue)
  }
})
</script>

<style lang="scss" scoped>
.diagram-renderer {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  border: 1px solid #ddd;
  background-color: white;
  .diagram-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
    overflow: auto;
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }

  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
    margin-bottom: 10px;
  }

  .error-message {
    color: red;
    padding: 10px;
    text-align: center;
  }
}


@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
