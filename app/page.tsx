"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Post = {
  title: string;
  slug: string;
  content: string;
  createdAt: string;
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return (
    <div className="flex justify-center items-center min-h-[40vh]">
      <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span className="ml-3 text-gray-600 text-lg">Loading...</span>
    </div>
  );
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900">Latest Blog Posts</h1>
      <div className="flex flex-col gap-8">
        {posts.map((post, idx) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="block rounded-xl border border-gray-200 shadow-sm p-6 transition-all duration-300 hover:shadow-lg group opacity-0 animate-fadeIn bg-white"
            style={{ animationDelay: `${idx * 80}ms`, animationFillMode: 'forwards' }}
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{post.title}</h3>
            <div className="text-gray-600 text-sm mb-3">By Admin User on {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {post.content.replace(/<[^>]+>/g, '').slice(0, 120)}{post.content.length > 120 ? '...' : ''}
            </p>
            <span className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">Read More &rarr;</span>
          </Link>
        ))}
      </div>
      {posts.length === 0 && <div className="mt-4 text-gray-500">No posts found.</div>}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </div>
  );
}
