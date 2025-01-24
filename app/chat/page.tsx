'use client'; // Mark this as a Client Component

import Chat from "@/components/Chat";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function ChatPage() {
  const { isLoaded, user } = useUser();

  // Redirect to sign-in if the user is not authenticated
  if (!isLoaded) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900/70 via-black/80 to-green-900/70">
        {/* Animated Matrix Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-black/80 to-green-900/70 animate-gradient-x">
          <div className="absolute inset-0 bg-matrix opacity-30"></div>
        </div>

        {/* Loading Spinner */}
        <div className="relative z-10 flex items-center justify-center space-x-2 text-green-400">
          <div className="w-6 h-6 border-4 border-t-4 border-t-green-400 border-gray-800 rounded-full animate-spin"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect("/sign-in"); // Redirect to sign-in page if the user is not authenticated
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-900/70 via-black/80 to-green-900/70">
      {/* Animated Matrix Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-black/80 to-green-900/70 animate-gradient-x">
        <div className="absolute inset-0 bg-matrix opacity-30"></div>
      </div>

      {/* Chat Component */}
      <div className="relative z-10">
        <Chat userId={user.id} />
      </div>
    </div>
  );
}

