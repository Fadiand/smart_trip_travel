'use client';

import { useUser } from '@/componets/store/ContexApi';
import GoogleLoginButton from '@/componets/google/GoogleLoginButton';

export default function GoogleButton() {
  const { username, logout } = useUser();

  return (
    <li>
      {username ? (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <h3 style={{ color: "white" , marginBottom : '24px' }}>Hi, {username}</h3>
          <button onClick={logout} style={{
            background: "#ef4444",
            border: "none",
            color: "white",
            padding: "0.4rem 0.8rem",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: '24px',
            marginRight: '10px',
          }}>
            Logout
          </button>
        </div>
      ) : (
        <GoogleLoginButton />
      )}
    </li>
  );
}
