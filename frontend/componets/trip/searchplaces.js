
export async function searchPlacesByTags(tags, destination) {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const results = [];
  
    for (const tag of tags) {
      const query = `${tag} in ${destination}`;
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === 'OK') {
        results.push({
          tag,
          places: data.results.slice(0, 3).map(place => ({
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            location: place.geometry.location,
          }))
        });
      } else {
        console.warn(`No results for "${query}", status: ${data.status}`);
      }
    }
  
    return results;
  }
  