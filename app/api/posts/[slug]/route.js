import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/lib/postModel';

export async function GET(req, { params }) {
  await connectDB();
  const { slug } = params;
  try {
    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json({ success: false, message: 'Post not found.' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      post: {
        title: post.title,
        content: post.content,
        slug: post.slug,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const { slug } = params;
  try {
    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json({ success: false, message: 'Title and content are required.' }, { status: 400 });
    }
    // Generate new slug if title changes
    function slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');
    }
    const newSlug = slugify(title);
    // Check for duplicate slug (if changed)
    if (newSlug !== slug) {
      const existing = await Post.findOne({ slug: newSlug });
      if (existing) {
        return NextResponse.json({ success: false, message: 'A post with this title/slug already exists.' }, { status: 409 });
      }
    }
    const updated = await Post.findOneAndUpdate(
      { slug },
      { title, content, slug: newSlug, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Post not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { slug } = params;
  try {
    const deleted = await Post.findOneAndDelete({ slug });
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Post not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Post deleted.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
} 