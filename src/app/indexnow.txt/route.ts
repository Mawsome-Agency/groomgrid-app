import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('e305c63c51671ad82d02b9be6bed7b69', {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
