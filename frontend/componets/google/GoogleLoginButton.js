'use client';

import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

const GoogleLoginButton = () => {
  const router = useRouter();

  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:8000/auth/google_auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      if (!res.ok) {
        throw new Error("Failed to authenticate with Google");
      }

      const data = await res.json();
      console.log("✅ Login Success:", data);

      // שמירת ה־JWT ב־localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("user_email", data.email);
      localStorage.setItem("username", data.username);

      console.log()
      router.push("/"); // או כל דף אחר באתר שלך
    } catch (err) {
      console.error("❌ Google login error:", err);
      alert("Google login failed.");
    }
  };

  const handleFailure = () => {
    alert("Google login was unsuccessful.");
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
