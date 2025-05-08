const { default: fetch } = await import('node-fetch')

const API_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'

exports.handler = async function (event, context) {
  // Check if method is POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    }
  }

  // Parse request body
  let requestBody
  try {
    requestBody = JSON.parse(event.body)
    if (!requestBody.description) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Description is required' }),
      }
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    }
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.VITE_OPEN_ROUTER_API_KEY}`,
        'HTTP-Referer': 'https://your-site.netlify.app',
        'X-Title': 'Digraph Converter',
      },
      body: JSON.stringify({
        model: 'google/gemma-3-27b-it:free',
        messages: [
          {
            role: 'system',
            content: `You are a specialized AI that converts natural language descriptions into
            digraph syntax. Always return ONLY valid digraph code with no explanation or additional
            text. The output should start with "digraph { and end with }" For multiple steps,
            use different shapes and connections to represent the described diagram.
            Use appropriate shapes, connections, and labels to represent the described diagram.
            Don't use style inside code`,
          },
          {
            role: 'user',
            content: `Convert this description to digraph syntax: "${requestBody.description}"`,
          },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      }),
    })

    const data = await response.json()
    const result = data.choices[0].message.content.trim()

    return {
      statusCode: 200,
      body: JSON.stringify({ result, error: null }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ result: null, error: error.message }),
    }
  }
}
