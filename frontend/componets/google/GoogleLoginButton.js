'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/componets/store/ContexApi';
import { FcGoogle } from 'react-icons/fc';

export default function CustomGoogleLogin() {
  const router = useRouter();
  const { setUsername } = useUser();

  useEffect(() => {
    window.google?.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const res = await fetch("http://localhost:8000/auth/google_auth/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: response.credential }),
          });

          if (!res.ok) throw new Error("Google auth failed");
          const data = await res.json();

          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("user_email", data.email);
          localStorage.setItem("username", data.username);

          setUsername(data.username);
          router.push("/start-trip");
        } catch (err) {
          console.error("Login error:", err);
          alert("Google login failed.");
        }
      },
    });
  }, []);

  // כפתור מותאם
  const handleGoogleClick = () => {
    window.google?.accounts.id.prompt(); // יפתח את popup ההתחברות
  };

  return (
    <button
      onClick={handleGoogleClick}
      style={{
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        padding: '2px 8px',
        borderRadius: '999px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginLeft : '100px',
      }}
    >
        <FcGoogle size={30} style={{ marginLeft: '0px' , padding: '0' }} />
    </button>
  );
}
