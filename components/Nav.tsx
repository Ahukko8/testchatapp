import Link from 'next/link'
import React from 'react'

const Nav = () => {
  return (
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
  )
}

export default Nav