import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface TypingTextProps {
  text: string
  className?: string
}

const TypingText: React.FC<TypingTextProps> = ({ text, className }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, staggerChildren: 0.05 }}
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  const NavLinks: React.FC = () => (
    <>
      <a 
        href="/chat" 
        className="text-gray-300 hover:text-white transition-colors py-2 block md:inline"
        onClick={() => setIsMenuOpen(false)}
      >
        Chat
      </a>
      <a 
        href="/about" 
        className="text-gray-300 hover:text-white transition-colors py-2 block md:inline"
        onClick={() => setIsMenuOpen(false)}
      >
        About
      </a>
      <a 
        href="/docs" 
        className="text-gray-300 hover:text-white transition-colors py-2 block md:inline"
        onClick={() => setIsMenuOpen(false)}
      >
        Docs
      </a>
    </>
  )

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/70 via-black/80 to-green-900/70 animate-gradient-x">
        <div className="absolute inset-0 bg-matrix opacity-30"></div>
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <nav className="bg-black/50 backdrop-blur-sm border-b border-green-800/30 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-400">LUREX AI</h1>
            
            <div className="hidden md:flex space-x-4">
              <NavLinks />
            </div>
            
            <div className="md:hidden">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {isMenuOpen ? <X className="h-6 w-6 text-green-400" /> : <Menu className="h-6 w-6 text-green-400" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-black/90 border-l border-green-800/30">
                  <div className="flex flex-col space-y-4 pt-8">
                    <NavLinks />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600"
            >
              <TypingText 
                text="LUREX AI" 
                className="text-green-400"
              />
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-green-200 mb-8"
            >
              <TypingText 
                text="AI-powered assistant for seamless conversations and productivity." 
                className="inline"
              />
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 transition-colors"
              >
                <a href="/chat">
                  Get Started
                </a>
              </Button>
            </motion.div>
          </div>
        </main>

        <footer className="bg-black/50 backdrop-blur-sm border-t border-green-800/30 p-4">
          <div className="container mx-auto text-center text-green-300">
            <p>&copy; 2025 LUREX. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="/privacy" className="hover:text-green-100">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-green-100">
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </div>

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
  )
}

export default HomePage