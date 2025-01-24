'use client'; // Mark this as a Client Component
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
     <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md rounded-lg shadow-lg p-8">
          <SignUp />
        </div>
      </div>
  );
}