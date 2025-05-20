import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export async function analyzeTripIntent(preferences, destination, weather, startDate, endDate) {
  if (!preferences || !destination || !startDate || !endDate) {
    console.log("messing one of the elements");
    return [];
  }
  const start = new Date(startDate);
  const end = new Date(endDate);
  const numDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const maxPlaces = numDays * 5;


  const weatherDescription = weather?.description?.toLowerCase() || 'clear';

  const badWeather = ['rain', 'snow', 'storm', 'thunder', 'shower'].some(w =>
    weatherDescription.includes(w)
  );

  const weatherText = badWeather
    ? `The weather is expected to be bad (${weatherDescription}), so avoid outdoor places like beaches, open parks, or hikes. Focus on indoor attractions such as museums, historic buildings, covered markets, or galleries.`
    : `The weather is expected to be good (${weatherDescription}), so you may include outdoor attractions such as scenic lookouts, nature parks, waterfront walks, or open-air monuments.`;

    const prompt = `
    You are a professional travel assistant. A user is planning a ${numDays}-day trip to ${destination}.
    The weather is: ${weatherDescription}.
    User travel preferences: "${preferences}"
    
    ${weatherText}
    
    Based on this, suggest a **curated list of up to ${maxPlaces} real, specific, and unique tourist attractions, landmarks, or hidden gems in ${destination}** that match the user's style and are worth visiting. Also, include 1 great restaurant recommendation per day.
    
    Avoid general terms like "museum", "restaurant", or "beach" — instead, list real place names (e.g., "Eiffel Tower", "Casa Batlló", "Montmartre", "Bunkers del Carmel").
    
    Avoid duplicates  even if they are variants of the same place name. Prioritize interesting, top-rated, culturally rich, or locally loved places.
    
    
    Return the result **only** as a valid JSON array of strings (no explanations, no extra formatting).
    `;
    
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a travel planner assistant.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.6,
    max_tokens: 800,
  });

  const content = response.choices[0].message.content;

  const cleaned = content
    .replace(/^```json\s*/i, '')
    .replace(/```$/, '')
    .trim();

  try {
    const places = JSON.parse(cleaned);
    if (Array.isArray(places)) {
      return places;
    } else {
      console.error(" LLM response was not an array:", places);
      return [];
    }
  } catch (e) {
    console.error(" Failed to parse LLM response:", content);
    return [];
  }
}
