import { useState } from "react";
import { useUser } from "../store/ContexApi"
import { createTrip } from "../trip/action";
import { useRouter } from "next/navigation";

export default function DifferentTripButton() {

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { username } = useUser();
    const router = useRouter();
    
    const handleConfirm = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/trip/by-username?username=${username}`);

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Server error:", errorText);
                throw new Error("Failed to save trip");
            }
    
            const data = await res.json();   
            if (!data.success) {
                alert("No previous trip data found.");
                return;
            }
            console.log(data);
    
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("destination", data.destination);
            formData.append("startDate", data.startDate);
            formData.append("endDate", data.endDate);
            formData.append("preferences", data.preferences);
            formData.append("budget", data.budget);
    
            await createTrip(formData);
            router.push('/result');
        } catch (err) {
            console.log("error was found :", err);
            alert("some problem occurred");
        }
        finally {
            setLoading(false);
            setShowModal(false);

        }
          
       
    }

    return (
        <>
        <div className='new-trip'>
        <strong>
        <p> U didnt like the trip result ? Click here for new result </p>
        </strong>
        <button className="diff-trip" onClick={() => setShowModal(true)} disabled={loading}>
        {loading ? "Loading..." : "Different Trip"}
        </button> 
                
        {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Want a different trip?</h3>
            <p>Use same details or change them?</p>
            <div className="modal-buttons">
              <button onClick={handleConfirm} disabled={loading}>
                {loading ? "Loading..." : "Use same data"}
              </button>
              <button onClick={() => router.push('/start-trip')}>
                Change details
              </button>
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}     
      </div>
        </>
    )
    
 }