
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import { AnimatePresence } from 'framer-motion';
import { ClerkProvider,  } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Lurex AI',
  description: 'Your AI-powered assistant for seamless conversations and productivity.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-gray-900 text-gray-100`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}