'use client';

import { useFormStatus } from "react-dom";
export default function StartButton() {
    const { pending } = useFormStatus()
    return (
        <button disabled={pending} className="submit-button">
            {pending ? 'submitting...' : 'Find My Trip'}
        </button>
    );
};



