import axios from "axios"

const NETLIFY_FUNCTION_URL = '/.netlify/functions/api'

export function convertNLToBlockDiag(text) {
  return axios.post(
    NETLIFY_FUNCTION_URL,
    {
      description: text
    }
  )
    .then(response => {
      return { result: response.data.result, error: null }
    })
    .catch(error => {
      return {
        result: null,
        error: error.response?.data?.error || 'Error converting text to digraph syntax'
      }
    })
}
