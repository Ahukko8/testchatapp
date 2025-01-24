import Link from 'next/link'
import React from 'react'

const Home = () => {
  return (
    <>
     <nav className="bg-gray-800 border-b border-gray-700 p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold">LUREX AI</h1>
      <div className="flex space-x-4">
        <Link href="/chat" className="text-gray-300 hover:text-white">
          Chat
        </Link>
        <Link href="/about" className="text-gray-300 hover:text-white">
          About
        </Link>
        <Link href="/docs" className="text-gray-300 hover:text-white">
          Docs
        </Link>
      </div>
    </div>
  </nav>
    <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-5xl font-bold mb-4">Welcome to LUREX AI</h1>
      <p className="text-xl text-gray-300 mb-8">
        Your AI-powered assistant for seamless conversations and productivity.
      </p>
      <Link
        href="/chat"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get Started
      </Link>
    </div>
  </div>
  <footer className="bg-gray-800 border-t border-gray-700 p-4">
    <div className="container mx-auto text-center text-gray-300">
      <p>&copy; 2025 LUREX. All rights reserved.</p>
      <div className="mt-2">
        <Link href="/privacy" className="hover:text-white">
          Privacy Policy
        </Link>
        <span className="mx-2">|</span>
        <Link href="/terms" className="hover:text-white">
          Terms of Service
        </Link>
      </div>
    </div>
  </footer>
  </>
   
  )
}

export default Home