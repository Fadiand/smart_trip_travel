import Home from "./home/page";


export default function App() {
  return (
    <>
      <Home />

      <>
      <div style={{ maxWidth: '800px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Your Trip Trailer 🎥</h2>
      <video
        src="/videos/trip.mp4"
        controls
        autoPlay
        style={{ width: '100%', borderRadius: '12px', boxShadow: '0 0 20px #0ff3' }}
      />
    </div>
      </>
    </>
  );
}
