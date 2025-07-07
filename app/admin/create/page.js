"use client";
import { useState } from "react";

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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

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
      <h1 className="text-2xl font-bold mb-4 text-black">Create Post</h1>
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
          <textarea
            className="w-full border border-black text-black rounded px-3 py-2 min-h-[120px] bg-white"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
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