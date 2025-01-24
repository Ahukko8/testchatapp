'use client'; // Mark this as a Client Component

import { motion } from 'framer-motion';


export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col min-h-screen bg-gray-900 text-gray-100"
    >

      <Home />      
    </motion.div>
  );
}