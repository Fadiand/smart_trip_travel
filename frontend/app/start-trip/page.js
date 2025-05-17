'use client';

import { useUser } from "@/componets/store/ContexApi";
import { createTrip } from '@/componets/trip/action';
import StartButton from '@/componets/trip/button';
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function StartTrip() {
  const { username, email } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    formData.set('username', username || '');
    formData.set('email', email || '');

    try {
      await createTrip(formData);
      router.push('/result'); 
    } catch (err) {
      console.error("Trip creation failed:", err);
      alert("Something went wrong...");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="start-page">
      {loading ? (
        <div className="loader">Loading...</div>
      ) : (
        <>
          <h1>Plan Your Perfect Trip</h1>

          <form className="trip-form" onSubmit={handleSubmit}>
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
              <label>Budget ($)</label>
              <input type="number" name="budget" placeholder="Optional" />
            </div>

            <StartButton loading={loading} />
          </form>
        </>
      )}
    </main>
  );
}
