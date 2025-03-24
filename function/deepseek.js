const Groq = require('groq-sdk');
require("../settings.js");

let api = [
  "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",
  "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"
];

let apikey = api[Math.floor(Math.random() * api.length)];

const client = new Groq({
  apiKey: apikey,
});

async function DeepSeek(teks, prompt = "sekarang kamu adalah AI yang mengetahui tentang semua bahasa pemrograman dan selalu gunakan bahasa Indonesia saat menjawab semua pertanyaan!") {
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: teks }
      ],
      model: 'deepseek-r1-distill-qwen-32b',
    });

    return chatCompletion.choices[0].message.content;
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

module.exports = { DeepSeek };
