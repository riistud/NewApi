const Groq = require('groq-sdk');
const { creator } = require("../settings.js"); // Pastikan settings.js ada

let apiKeys = [
  "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"
];

let apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

const client = new Groq({ apiKey });

function groq(teks, prompt = `Jawab langsung dalam bahasa Indonesia tanpa "<think>" atau pemikiran tambahan.`) {
  return client.chat.completions.create({
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: teks }
    ],
    model: 'llama-3.3-70b-versatile',
  })
  .then(chatCompletion => {
    let response = chatCompletion.choices[0]?.message?.content || "Tidak ada respons dari AI";
    
    // Hapus bagian "<think>...</think>"
    response = response.replace(/<think>.*?<\/think>/gs, '').trim();

    return {
      status: true, 
      creator,
      respon: response
    };
  })
  .catch(e => ({
    status: false, 
    creator,
    respon: "Error: " + e.message  
  }));
}

module.exports = { groq };