import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/lib/postModel';

export async function GET() {
  await connectDB();
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 