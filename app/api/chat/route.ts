import { NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";


export const runtime = 'edge'; // Optional: Use Vercel's Edge Runtime for faster responses

export async function POST(req: Request) {
  const { userId } = await auth(); // Get the authenticated user's ID

  // Check if the user is authenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { message } = await req.json();

    // Call Together.ai API
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free', // Example model, choose one from Together.ai
        messages: [
          { role: 'system', content: `You are chatting with user ${userId}.` }, // Optional: Include userId for personalization
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Together.ai API error: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}