import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Optional: Use Vercel's Edge Runtime for faster responses

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free', // Example model, choose one from Together.ai
        messages: [{ role: 'user', content: message }],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}