<template>
  <div class="page-wrapper">
    <div class="chatbot">
      <div class="chat-messages" ref="messageContainer">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
          <span v-html="message.text.replace(/\n/g, '<br/>')" />
        </div>
      </div>
      <div class="chat-input">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Type a message..."
          type="text"
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
    <div id="diagram">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatBot',
  data() {
    return {
      messages: [],
      userInput: '',
      diagramSource: `graph TD
      A[Start] --> B{Is it?};
      B -- Yes --> C[OK];
      C --> D[Rethink];
      D --> B;
      B -- No --> E[End];
      `,
    }
  },
  methods: {
    generateDiagram(data) {
      const payload = {
        diagram_source: data,
        diagram_type: 'graphviz',
        output_format: 'svg',
      }
      fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          return response.text() // because SVG is text
        })
        .then((svg) => {
          // Create new div for the SVG
          const diagramDiv = document.getElementById('diagram')
          diagramDiv.innerHTML = svg
          document.getElementById('diagram').appendChild(diagramDiv)
        })
        .catch((error) => {
          console.error('Error generating diagram:', error)
        })
    },
    sendMessage() {
      if (!this.userInput.trim()) return

      // Add user message
      this.messages.push({
        text: this.userInput,
        type: 'user',
      })
      const prompt = `You are a Graphviz code generator.
– Take the input text and split it into phrases using the period (".") as a separator.
– Do not split further. Treat each phrase exactly as-is — including verbs like "add", "make", "update", etc.
– Each phrase becomes a node. Wrap each node in double quotes.
– Draw a directed edge from each phrase to the next in order.
– Output must start with 'digraph {' and end with '}'.
– Do NOT add labels, node IDs, or comments. Do NOT summarize or interpret meaning.
– Only return valid Graphviz code.
Input:
${this.userInput}

Output (only graphviz code):`
      fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma3:12b',
          prompt,
          stream: false,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Add bot response
          this.messages.push({
            text: data.response.replace(/\n/g, ''),
            type: 'bot',
          })
          this.generateDiagram(data.response.replace(/\n/g, ''))
        })
        .catch((error) => {
          // Handle error with fallback message
          this.messages.push({
            text: 'Sorry, I encountered an error processing your request.',
            type: 'bot',
          })
          console.error('Error:', error)
        })
      this.userInput = ''
      this.scrollToBottom()
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messageContainer
        container.scrollTop = container.scrollHeight
      })
    },
  },
}
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  background-color: #f8f9fa;
}
.page-wrapper > div {
  margin: 0 auto;
}
.chatbot {
  width: 100%;
  max-width: 500px;
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  margin: 0.5rem 0;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  max-width: 70%;
}

.user {
  background-color: #007bff;
  color: white;
  margin-left: auto;
}

.bot {
  background-color: #e9ecef;
  margin-right: auto;
}

.chat-input {
  display: flex;
  padding: 1rem;
  gap: 0.5rem;
  border-top: 1px solid #ccc;
}

input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
