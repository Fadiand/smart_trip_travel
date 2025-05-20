// distanceUtils.js

// שלב 1 – פונקציה לחישוב מרחק בין שתי נקודות
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // רד"ק כדור הארץ
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  function toRadians(deg) {
    return deg * (Math.PI / 180);
  }
  
  // שלב 2 – בניית מטריצת מרחקים
  export function buildDistanceMatrix(places) {
    const n = places.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          const from = places[i].location;
          const to = places[j].location;
          matrix[i][j] = calculateDistanceKm(from.lat, from.lng, to.lat, to.lng);
        }
      }
    }
  
    return matrix;
  }
  
  // שלב 3 – בחירת נקודת התחלה אסטרטגית
  export function findBestStartingIndex(matrix) {
    const totalDistances = matrix.map(row => row.reduce((sum, val) => sum + val, 0));
    const minIndex = totalDistances.indexOf(Math.min(...totalDistances));
    return minIndex; // המקום שהכי קרוב לכולם בסה"כ
}
  
// מחזירה את הסדר של הביקור במקומות (לפי אינדקסים) לפי אלגוריתם גרידי פשוט
export function buildGreedyPath(matrix, startIndex) {
    const n = matrix.length;
    const visited = Array(n).fill(false);
    const path = [startIndex];
    visited[startIndex] = true;
  
    let current = startIndex;
  
    for (let step = 1; step < n; step++) {
      let nearest = -1;
      let minDist = Infinity;
  
      for (let i = 0; i < n; i++) {
        if (!visited[i] && matrix[current][i] < minDist) {
          minDist = matrix[current][i];
          nearest = i;
        }
      }
  
      if (nearest !== -1) {
        path.push(nearest);
        visited[nearest] = true;
        current = nearest;
      }
    }
  
    return path;
  }
  
  