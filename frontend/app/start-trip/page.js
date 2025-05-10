import { createTrip } from '@/componets/trip/action';
import StartButton from '@/componets/trip/button';

export default function StartTrip() {

  return (
    
    <main className="start-page">
      <h1>Plan Your Perfect Trip</h1>

      <form className="trip-form" action={createTrip}>
        <div className="form-group">
          <label>Destination</label>
          <input type="text" name="destination" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" required />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" required />
          </div>
        </div>

        <div className="form-group">
          <label>Trip Style</label>
          <input type="text" name="preferences" placeholder="Romantic, Adventure..." />
        </div>

        <div className="form-group">
          <label>Budget (€)</label>
          <input type="number" name="budget" placeholder="Optional" />
        </div>

        <StartButton />
      </form>
    </main>
  );
}
