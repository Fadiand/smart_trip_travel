# Smart Trip Planner 

An AI-powered travel planner that creates personalized daily itineraries based on user preferences, weather, and real-world location data.

## Features
-  OpenAI integration for smart destination suggestions  
-  Google Places API to find top-rated attractions and restaurants  
-  Generates daily schedules (09:00–17:00) with optimized routes  
-  Weather-aware planning (indoor/outdoor)  
-  Interactive Map (Leaflet)  
-  Built-in chatbot for travel questions  
-  Google login and session management  
-  Fullstack: React (Next.js) + Django backend  

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Install all dependencies:**

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   pip install -r requirements.txt
   ```

3. **Set environment variables:**

   Create `.env` files in both `frontend/` and `backend/` directories with the following:

   ```bash
   OPENAI_API_KEY=your_openai_key
   GOOGLE_PLACES_API_KEY=your_google_places_key
   OPENWEATHER_API_KEY=your_openweather_key
   ```

4. **Run the app locally:**

   ```bash
   # Run backend
   cd backend
   python manage.py runserver
   ```

   In a **separate terminal**:

   ```bash
   cd frontend
   npm run dev
   ```
