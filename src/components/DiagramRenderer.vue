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
    <button
      v-if="blockDiagCode"
      class="download-btn"
      @click="downloadSVG"
    >
      Download SVG
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as d3 from 'd3'
import 'd3-graphviz'
import Toolbar from './ToolBar.vue'

const props = defineProps({
  blockDiagCode: {
    type: String,
    default: null
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  }
})

const selectedNode = ref(null)
const selectedEdge = ref(null)
const initialTransform = ref('')

const configGraph = () => {
  const nodes = d3.selectAll('.node')
  const edges = d3.selectAll('.edge')
  nodes.selectAll('polygon, ellipse').attr("fill", "white")
  centerDiagram()
  d3.select('#graph0 polygon:first-child').attr('fill', 'transparent')
  d3.select('.diagram-container').on('click mousedown', (event) => {
    event.preventDefault()
    event.stopPropagation()
    selectedNode.value = null
    selectedEdge.value = null
    highlightSelectedNode(null)
  })

  nodes.on('click mousedown', (event) => {
    event.preventDefault()
    event.stopPropagation()
    selectedNode.value = d3.select(event.currentTarget)
    selectedEdge.value = null
    highlightSelectedNode(event.currentTarget)
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
    const width = document.querySelector('.diagram-container').offsetWidth
    const height = document.querySelector('.diagram-container').offsetHeight

    const diagram = code.replace(/\n/g, ' ')
    await d3.select('.diagram-container')
      .graphviz()
      .width(width)
      .height(height)
      .zoom(true)
      .renderDot(diagram)
      .on('end', () => {
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
  if (element) {
    const bbox = d3.select(element).node().getBBox()
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    rect.setAttribute('x', bbox.x - 3)
    rect.setAttribute('y', bbox.y - 3)
    rect.setAttribute('width', bbox.width + 6)
    rect.setAttribute('height', bbox.height + 6)
    rect.setAttribute('fill', 'none')
    rect.setAttribute('stroke', '#2696ff')
    rect.setAttribute('id', 'boundary')
    element.insertBefore(rect, element.firstChild)
  }
}

const updateTextStyle = (style) => {
  if (style.type === 'text') {
    selectedNode.value.selectAll('text').text(style.value)
  } else {
    selectedNode.value.selectAll('text').attr(style.type, style.value)
  }
}
const updateNodeStyle = (style) => {
  if (selectedNode.value) {
    selectedNode.value.selectAll('polygon, ellipse').attr(style.type, style.value)
  }
  if (selectedEdge.value) {
    selectedEdge.value.selectAll('path, polygon').attr(style.type, style.value)
  }
}

const centerDiagram = () => {
  const svg = document.querySelector('.diagram-container svg')
  const graph = d3.select('#graph0')
  initialTransform.value = graph.attr('transform')
  if (svg) {
    const viewBox = svg.getAttribute('viewBox')
    const [x, y, width, height] = viewBox.split(' ').map(Number)
    const graphBBox = graph.node().getBBox()
    const graphWidth = graphBBox.width
    const graphHeight = graphBBox.height
    const scaleX = graphWidth > width ? width / graphWidth : 1
    const scaleY = graphHeight > height ? height / graphHeight : 1
    const scale = Math.min(scaleX, scaleY)
    const newWidth = width / scale
    const newHeight = height / scale
    const centreX = -((newWidth - graphWidth) / 2)
    const centreY = -((newHeight - graphHeight) / 2)
    svg.setAttribute('viewBox', `${centreX} ${centreY} ${newWidth} ${newHeight}`)
  }
}

const downloadSVG = () => {
  const graph = d3.select('#graph0')
  const graphBBox = graph.node().getBBox()
  const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const svgSelection = d3.select(svgElement)
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .attr('width', graphBBox.width)
    .attr('height', graphBBox.height)
    .attr('viewBox', `${graphBBox.x} ${graphBBox.y} ${graphBBox.width} ${graphBBox.height}`)

  const clonedGraph = graph.node().cloneNode(true)

  d3.select(clonedGraph).attr('transform', null)

  svgSelection.node().appendChild(clonedGraph)
  const svgString = new XMLSerializer().serializeToString(svgElement)
  const blob = new Blob([svgString], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  const link = d3.create('a')
    .attr('href', url)
    .attr('download', `diagram-${(Math.random() + 1).toString(36).substring(7)}.svg`)
    .node()

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

onMounted(() => {
  renderDiagram(props.blockDiagCode)
})

watch(() => props.blockDiagCode, (newValue) => {
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
  background-color: #f7f9fb;
  text-align: center;
  position: relative;
  .diagram-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
    overflow: auto;
    text-align: center;
  }
  .download-btn {
    margin: 10px;
    padding: 8px 12px;
    background-color: #5273ce;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    position: absolute;
    bottom: 10px;
    right: 0;
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
    overflow: hidden;
  }

  .error-message {
    color: red;
    padding: 10px;
    text-align: center;
  }
}
</style>
