// app/api/images/[id]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import Image from '@/models/Image';
import { isValidObjectId } from 'mongoose';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    // Ensure MongoDB connection
    await connectDB();

    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Validate image ID format
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: 'Invalid image ID format' }, { status: 400 });
    }

    // Find and delete the image, ensuring it belongs to the current user
    const deletedImage = await Image.findOneAndDelete({
      _id: id,
      userId: userId
    });

    // Check if image was found and deleted
    if (!deletedImage) {
      return NextResponse.json({ 
        error: 'Image not found or unauthorized to delete' 
      }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Image deleted successfully',
      id: deletedImage._id
    });

  } catch (error: unknown) {
    // Type-safe error handling
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error deleting image:', error);
    
    return NextResponse.json({ 
      error: 'Failed to delete image',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}