import { generateImage } from '../../actions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, imageUrl } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt is required.' }, { status: 400 });
    }
    const result = await generateImage(prompt, imageUrl);
    if (!result) {
      return NextResponse.json({ error: 'Image generation failed.' }, { status: 500 });
    }
    return NextResponse.json({ ...result });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
