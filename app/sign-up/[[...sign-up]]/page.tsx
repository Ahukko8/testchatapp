'use client'; // Mark this as a Client Component

import { SignUp } from '@clerk/nextjs';
export const runtime = 'edge';

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900/70 via-black/80 to-green-900/70">
      {/* Animated Matrix Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-black/80 to-green-900/70 animate-gradient-x">
        <div className="absolute inset-0 bg-matrix opacity-30"></div>
      </div>

      {/* SignIn Form */}
      <div className="relative z-10 w-full max-w-md p-6 rounded-lg shadow-lg bg-black/50 backdrop-blur-sm border border-green-800/30">
        <SignUp />
      </div>

      {/* Global Styles for Matrix Effect */}
      <style jsx global>{`
        @keyframes matrix {
          0% { background-position: 0 0; }
          100% { background-position: 100% 100%; }
        }
        .bg-matrix {
          background-image: 
            linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          animation: matrix 10s linear infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
