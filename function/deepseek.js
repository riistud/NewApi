const axios = require("axios")

async function DeepSeek(prompt, isR1 = false) {
  let model = isR1 ? 'deepseek-ai/DeepSeek-R1' : 'deepseek-ai/DeepSeek-V3'

  try {
    const response = await axios.post(
      'https://api.blackbox.ai/api/chat',
      {
        messages: [{ content: prompt, role: "user" }],
        model,
        max_tokens: '1024',
      },
      { headers: { 'Content-Type': 'application/json' } }
    )

    return response.data.replace(/\*\*/g, '*').trim().split("</think>")[1].trim()
  } catch (error) {
    console.error(error)
  }
}

module.exports = { DeepSeek }