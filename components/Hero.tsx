import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
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
  )
}

export default Hero