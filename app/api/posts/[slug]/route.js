// app/api/posts/[slug]/route.js

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Post from '@/lib/postModel';

export const dynamic = 'force-dynamic';

// ✅ GET /api/posts/[slug]
export async function GET(req, contextPromise) {
  const { params } = await contextPromise;  // await it here
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { success: false, message: 'Missing slug param' },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const post = await Post.findOne({ slug });
    if (!post) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, post }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ✅ PUT /api/posts/[slug]
export async function PUT(req, contextPromise) {
  const { params } = await contextPromise;
  const { slug } = params;

  await connectDB();

  try {
    const { title, content } = await req.json();
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required.' },
        { status: 400 }
      );
    }

    const slugify = (text) =>
      text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-');

    const newSlug = slugify(title);

    if (newSlug !== slug) {
      const exists = await Post.findOne({ slug: newSlug });
      if (exists) {
        return NextResponse.json(
          { success: false, message: 'Slug already in use' },
          { status: 409 }
        );
      }
    }

    const updated = await Post.findOneAndUpdate(
      { slug },
      { title, content, slug: newSlug, updatedAt: new Date() },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE /api/posts/[slug]
export async function DELETE(req, contextPromise) {
  const { params } = await contextPromise;
  const { slug } = params;

  await connectDB();

  try {
    const deleted = await Post.findOneAndDelete({ slug });
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Post not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: 'Post deleted' }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
