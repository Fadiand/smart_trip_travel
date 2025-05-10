import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function analyzeTripIntent(preferencesText, destination) {
    console.log("Loaded key:", process.env.OPENAI_API_KEY);
    const prompt = `
You are a professional travel assistant. A user is planning a trip to ${destination}.

Based on their preferences below, recommend **a curated list of 5–7 specific tourist attractions, landmarks, or hidden gems** that are **highly recommended** and **unique to ${destination}**.

Avoid general terms like "museum", "restaurant", or "beach" — instead, list **real places** with proper names (e.g., "Eiffel Tower", "Casa Batlló", "Montmartre", "Bunkers del Carmel"). You may include cultural districts, scenic viewpoints, historical landmarks, or vibrant neighborhoods.

Make sure the attractions are aligned with the user's travel style.

User preferences: "${preferencesText}"

Return the response **only** as a valid JSON array of strings. Example:
["Eiffel Tower", "Montmartre", "Seine River Cruise", "Saint-Germain-des-Prés", "Palace of Versailles", "Musée d'Orsay", "Luxembourg Gardens"]
`;

    

    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a travel planner assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 100,
      });
      

  const content = response.choices[0].message.content;

  try {
    return JSON.parse(content); // הופך את התשובה לרשימה
  } catch (e) {
    console.error("Failed to parse LLM response:", content);
    return [];
  }
}
