'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/componets/store/ContexApi';
import { GoogleLogin } from '@react-oauth/google';

export default function CustomGoogleLogin() {
  const router = useRouter();
  const { setUsername } = useUser();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:8000/auth/google_auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) throw new Error("Google auth failed");
      const data = await res.json();

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("username", data.username);

      setUsername(data.username);
      router.push("/home");
    } catch (err) {
      console.error("Login error:", err);
      alert("Google login failed.");
    }
  };

  return (
    <div style={{ marginBottom: '20px',  }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => {
          alert("Google login failed.");
        }}
        width="100"
        shape="pill"
        text="signin_with"
        theme="outline"
        locale="en"
        useOneTap={true}
        
      />
    </div>
  );
}
