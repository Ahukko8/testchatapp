/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useUser } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import axios, { AxiosResponse } from 'axios';
import { Download, ImageIcon, History, Loader2, Menu, Trash2, ArrowLeft, X } from 'lucide-react';

// Types
interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: Date;
}

interface GenerateResponse {
  id: string;
  imageUrl: string;
}

export default function AIImageGenerator() {
  const { isLoaded, user } = useUser();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const response: AxiosResponse<GeneratedImage[]> = await axios.get('/api/images/history');
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Failed to load history');
    }
  };

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setCountdown(40);
    setError(null);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 3000);

    try {
      const response: AxiosResponse<GenerateResponse> = await axios.post('/api/images/generate', { prompt });
      setCurrentImage(response.data.imageUrl);
      
      const newImage: GeneratedImage = {
        id: response.data.id,
        prompt,
        imageUrl: response.data.imageUrl,
        createdAt: new Date()
      };
      setHistory([newImage, ...history]);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteImage = (id: string) => {
    setHistory(history.filter(image => image.id !== id));
  };

  const downloadImage = async () => {
    if (!currentImage) return;
    
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-green-900/70 via-black/80 to-green-900/70">
      <div className="absolute inset-0 bg-matrix opacity-30"></div>
      <div className="relative z-10 flex flex-col h-screen">
        <button onClick={() => setMenuOpen(true)} className="absolute left-4 top-4 bg-black/50 p-2 rounded-full text-green-400">
          <Menu size={24} />
        </button>

        {menuOpen && (
          <div className="absolute left-0 top-0 w-64 h-full bg-black/80 p-4 border-r border-green-500/30">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => router.push('/')} className="flex items-center text-green-400">
                <ArrowLeft className="mr-2" /> Go Back
              </button>
              <button onClick={() => setMenuOpen(false)} className="text-green-400">
                <X size={24} />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-3xl mx-auto space-y-6 p-4 md:p-8">
            {currentImage && (
              <div className="relative">
                <img src={currentImage} alt="Generated preview" className="w-[20vw] rounded-lg" />
                <button onClick={downloadImage} className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-green-400">
                  <Download size={16} />
                </button>
              </div>
            )}
            <div className="bg-black/50 p-4 rounded-lg border border-green-500/30">
              <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe the image you want to generate..." className="w-full bg-black/30 text-green-400 border border-green-500/30 rounded p-3 min-h-[100px] focus:outline-none focus:border-green-500" />
              <button onClick={generateImage} disabled={isGenerating || !prompt.trim()} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center justify-center w-full md:w-auto disabled:opacity-50">
                {isGenerating ? <><Loader2 className="animate-spin mr-2" /> Our AI agents are hard at work, please wait a moment... ({countdown}s)</> : <><ImageIcon className="mr-2" /> Generate Image</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
