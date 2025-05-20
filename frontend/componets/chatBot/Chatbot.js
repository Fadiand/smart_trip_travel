'use client';
import { useEffect, useState } from 'react';
import { analyzeChatBot } from './LmmResponse';
import { useUser } from '@/componets/store/ContexApi'; // מקבל את שם המשתמש

export default function Chatbot() {
  const { username } = useUser();
  const [tripData, setTripData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
  
    const fetchTrip = async () => {
      try {
        const res = await fetch(`http://localhost:8000/trip/by-username?username=${username}`);
        const data = await res.json();
  
        if (!res.ok || !data.success) {
          console.error("Error while loading data:", data.error);
          return;
        }
  
        setTripData(data);
      } catch (err) {
        console.error("Error fetching trip:", err);
      }
    };
  
    fetchTrip();
  }, [username]);
  

  const handleSend = async () => {
    if (!userInput.trim() || !tripData) return;

    setMessages(prev => [...prev, { role: 'user', content: userInput }]);
    setUserInput('');
    setLoading(true);

    try {
      const reply = await analyzeChatBot(userInput, tripData);

      if (reply) {
        setMessages(prev => [...prev, { role: 'bot', content: reply }]);
      }
    } catch (err) {
      console.error("Erroe while sending to the LLM:", err);
      setMessages(prev => [...prev, { role: 'bot', content: 'Feaild send req to the LLM' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container">
      {!isOpen && (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          🤖
        </button>
      )}

      {isOpen && (
        <div className="chatbot-box">
          <div className="chatbot-header">
            <span> Ur Guide</span>
            <button className='close_btn' onClick={() => setIsOpen(false)}>✖</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && <div className="chat-message bot">...</div>}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Ask a question about the trip..."
              disabled={!tripData}
            />
            <button onClick={handleSend} disabled={!tripData}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
