import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/lib/postModel';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export async function POST(req) {
  await connectDB();
  try {
    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ success: false, message: 'Title and content are required.' }, { status: 400 });
    }
    const slug = slugify(title);
    // Check for duplicate slug
    const existing = await Post.findOne({ slug });
    if (existing) {
      return NextResponse.json({ success: false, message: 'A post with this title/slug already exists.' }, { status: 409 });
    }
    const post = await Post.create({ title, content, slug });
    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 