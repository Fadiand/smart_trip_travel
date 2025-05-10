export async function getWeather(cityName) {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`;
  
    const res = await fetch(url);
    const data = await res.json();
  
    if (data.cod === 200) {
      return {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      };
    } else {
      console.warn(`Weather API error: ${data.message}`);
      return null;
    }
  }
  