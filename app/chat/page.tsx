"use client"; // Mark this as a Client Component
import Chat from "@/components/Chat";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function ChatPage() {
  const { isLoaded, user } = useUser();

  // Redirect to sign-in if the user is not authenticated
  if (!isLoaded) {
    return <p>Loading...</p>; // Show a loading state
  }

  if (!user) {
    redirect("/sign-in"); // Redirect to sign-in page if the user is not authenticated
  }

  return (
    <div>
      <Chat userId={user.id} />
    </div>
  );
}
