import Link from 'next/link';

export default function About() {
  return (
    <main className="about-page">
      <h1>About Trip Planner</h1>
      <p className="intro">
        Trip Planner is your smart travel assistant.  
        We help you find the best destinations by analyzing price, weather, and experience level — all tailored to your preferences.
      </p>

      <section className="features">
        <div className="feature">
          <h2> Personalized Trips</h2>
          <p>Get travel suggestions based on your interests, budget, and time of year.</p>
        </div>
        <div className="feature">
          <h2>Real-Time Weather </h2>
          <p>We consider current and forecasted weather to make your trip comfortable and fun.</p>
        </div>
        <div className="feature">
          <h2> Smart Budgeting</h2>
          <p>Our engine compares travel options and shows you the most cost-effective ones.</p>
        </div>
      </section>

      <Link href="start-trip" >
      <button className="start-button">Start Planning</button>
      </Link>
    </main>
  );
}
