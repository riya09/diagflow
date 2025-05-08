import fetch from 'node-fetch'

const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

export async function handler(event, context) {
  const requestBody = JSON.parse(event.body)
  let response
  try {
    response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPEN_ROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Digraph Converter',
      },
      body: {
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
          content: `Convert this description to digraph syntax: "${requestBody}"`,
        },
        ],
        temperature: 0.2, // Lower temperature for more predictable outputs
        max_tokens: 2000,
      },
    })
    response = response.data.choices[0].message.content.trim()
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        result: null,
        error: err.message,
      }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      result: response,
      error: null,
    }),
  }
}
