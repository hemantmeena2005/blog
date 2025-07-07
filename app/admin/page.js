"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const res = await fetch("/api/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      } else {
        setError("Failed to load posts");
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setPosts(posts.filter((p) => p.slug !== slug));
      } else {
        alert("Failed to delete post");
      }
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
      </div>
      <Link href="/admin/create" className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Create New Post</Link>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.slug} className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-lg transition">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-lg text-blue-700 truncate">{post.title}</div>
              <div className="text-gray-500 text-xs mb-2">/{post.slug} • {new Date(post.createdAt).toLocaleString()}</div>
              <div className="text-gray-700 text-sm line-clamp-2 mb-2" dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]+>/g, '').slice(0, 120) + (post.content.length > 120 ? '...' : '') }} />
            </div>
            <div className="flex-shrink-0 flex gap-2 mt-2 md:mt-0 md:ml-4">
              <Link href={`/admin/edit/${post.slug}`} className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition">Edit</Link>
              <button
                className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition disabled:opacity-50"
                onClick={() => handleDelete(post.slug)}
                disabled={deleting === post.slug}
              >
                {deleting === post.slug ? "Deleting..." : "Delete"}
              </button>
              <Link href={`/posts/${post.slug}`} className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 transition" target="_blank" rel="noopener noreferrer">View</Link>
            </div>
          </div>
        ))}
      </div>
      {posts.length === 0 && <div className="mt-4 text-gray-500">No posts found.</div>}
    </div>
  );
} 