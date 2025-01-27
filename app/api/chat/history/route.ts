import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import connect from '@/lib/mongodb';
import Chat from '@/models/Chat';


export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connect();
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 }); // Fetch chats for the logged-in user
    return NextResponse.json(chats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
  }
}


export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { messages } = await req.json();

  try {
    await connect();
    const chat = await Chat.create({ userId, messages }); // Save chat with the logged-in user's ID
    return NextResponse.json(chat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save chat history' }, { status: 500 });
  }
}

export async function DELETE() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connect();
    await Chat.deleteMany({ userId }); // Delete all chat history for the logged-in user
    return NextResponse.json({ message: 'Chat history cleared' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to clear chat history' }, { status: 500 });
  }
}