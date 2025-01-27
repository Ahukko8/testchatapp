/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/images/generate/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Image from '@/models/Image';

export async function POST(req: Request) {
  try {
    // Ensure MongoDB connection
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Call Hugging Face API with proper error handling and timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stable-diffusion-v1-5/stable-diffusion-v1-5",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.HUGGING_FACE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            options: {
              wait_for_model: true,
              use_cache: true
            }
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Hugging Face API error:', errorData);
        return NextResponse.json({ error: 'Failed to generate image' }, { status: response.status });
      }

      const imageBlob = await response.blob();
      const buffer = await imageBlob.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const imageUrl = `data:image/jpeg;base64,${base64}`;

      // Save to MongoDB
      const newImage = await Image.create({
        userId,
        prompt,
        imageUrl
      });

      return NextResponse.json({
        id: newImage._id,
        imageUrl: imageUrl
      });

    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({ error: 'Image generation timed out' }, { status: 504 });
      }
      throw fetchError;
    }

  } catch (error: any) {
    console.error('Error in image generation:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}