"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useAdminAuth } from "../../../lib/AdminAuthContext";
import Link from "next/link";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export default function CreatePostPage() {
  const { isAdmin, login, logout, error } = useAdminAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [password, setPassword] = useState("");

  if (!isAdmin) {
    return (
      <div className="max-w-sm mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            login(password);
          }}
        >
          <div className="mb-6">
            <label htmlFor="admin-password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="admin-password"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setSlug(slugify(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Post created!" });
        setTitle("");
        setContent("");
        setSlug("");
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-black">Create New Post</h1>
        <div className="flex gap-2">
          <Link href="/admin" className="text-blue-600 hover:underline text-sm">← Back to Dashboard</Link>
          <button onClick={logout} className="text-red-600 hover:underline text-sm ml-2">Logout</button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1 text-black">Title</label>
          <input
            type="text"
            className="w-full border border-black text-black rounded px-3 py-2 bg-white"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-black">Content</label>
          <div className="w-full border border-black text-black rounded bg-white min-h-[120px]">
            <ReactQuill value={content} onChange={setContent} theme="snow" />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1 text-black">Slug</label>
          <input
            type="text"
            className="w-full border border-black text-black rounded px-3 py-2 bg-gray-100"
            value={slug}
            readOnly
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
        {message && (
          <div className={`mt-2 text-${message.type === "error" ? "red" : "green"}-600`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
} 