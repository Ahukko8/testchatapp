import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
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
  )
}

export default Footer