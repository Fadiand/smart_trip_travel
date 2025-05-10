'use client';

import { useUser } from '@/componets/google/AuthUser';
import GoogleLoginButton from '@/componets/google/GoogleLoginButton';

export default function GoogleButton() {
  const { username } = useUser();

  return (
    <li>
      {username ? (
        <h3 style={{ color: "white" }}>Hi, {username}</h3>
      ) : (
        <GoogleLoginButton />
      )}
    </li>
  );
}
