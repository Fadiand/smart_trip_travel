// app/lib/actions/analyzeChat.js
'use server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeChatBot(question, tripData) {
  const day = Math.floor((Date.now() - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24)) + 1;

    const prompt = `
    the user is on day ${day} of their trip in ${tripData.destination}, with preferences: ${tripData.preferences}.
    Quation:  "${question}".
    Please answer in a smart, kind, and helpful way. 
    If the question is in Hebrew, respond in Hebrew. 
    Keep the response concise and avoid unnecessary elaboration.    
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful travel assistant." },
      { role: "user", content: prompt }
    ]
  });

  return response.choices?.[0]?.message?.content || "i cound not understand u, can u repet?";
}
