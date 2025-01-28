// app/api/images/history/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Image from '@/models/Image';
export const runtime = 'edge';
export async function GET() {
  try {
    // Ensure MongoDB connection
    await connectDB();

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const images = await Image.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();

    return NextResponse.json(images);

  } catch (error: unknown) {
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error fetching history:', error);
    
    return NextResponse.json({ 
      error: 'Failed to fetch history',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}