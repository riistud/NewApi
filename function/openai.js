const Groq = require('groq-sdk');
require("../settings.js")

let api = [
"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"
]

let apikey = api[Math.floor(Math.random() * api.length)]

const client = new Groq({
  apiKey: apikey,
});

async function groq(teks, prompt = `pakai bahasa Indonesia aja`) {
try {
  const chatCompletion = await client.chat.completions
    .create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: teks }
      ],
      model: 'deepseek-r1-distill-qwen-32b',
    })
    .catch(async (err) => {
      if (err instanceof Groq.APIError) {
        console.log(err.status);
        console.log(err.name);
        console.log(err.headers);
      } else {
        throw err;
      }
    })
    
    return {
  status: true, 
  creator: global.creator,
  respon: chatCompletion.choices[0].message.content
  }
  
  } catch (e) {
  return {
  status: false, 
  creator: global.creator,
  respon: "Error :" + e  
  }
  }
}

module.exports = { groq }