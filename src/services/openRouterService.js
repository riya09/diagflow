import axios from "axios"

const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

const API_KEY = import.meta.env.VITE_OPEN_ROUTER_API_KEY || ''

export function convertNLToBlockDiag(text) {
  return axios.post(
    API_URL,
    {
      model: 'google/gemma-3-27b-it:free', // or any other compatible model
      messages: [
        {
          role: 'system',
          content: `You are a specialized AI that converts natural language descriptions into digraph syntax.
        Always return ONLY valid digraph code with no explanation or additional text.
        The output should start with "digraph { and end with }"
        For multiple steps, use different shapes and connections to represent the described diagram.
        Use appropriate shapes, connections, and labels to represent the described diagram.Don't use style inside code`,
        },
        {
          role: 'user',
          content: `Convert this description to digraph syntax: \"${text}\"`,
        },
      ],
      temperature: 0.2, // Lower temperature for more predictable outputs
      max_tokens: 2000,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Digraph Converter',
      },
    }
  )
    .then(response => {
      return { result: response.data.choices[0].message.content.trim(), error: null }
    })
  .catch(() => {
    return { result: null, error: 'Error converting text to digraph syntax' }
  })
}
