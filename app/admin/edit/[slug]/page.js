"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}

export default function EditPostPage({ params }) {
  const { slug } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editSlug, setEditSlug] = useState(slug);
  const [originalSlug, setOriginalSlug] = useState(slug);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      const res = await fetch(`/api/posts/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.post.title);
        setContent(data.post.content);
        setEditSlug(data.post.slug);
        setOriginalSlug(data.post.slug);
      } else {
        setMessage({ type: "error", text: "Post not found." });
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setEditSlug(slugify(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/posts/${originalSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "Post updated!" });
        if (editSlug !== originalSlug) {
          router.replace(`/admin/edit/${editSlug}`);
        }
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Edit Post</h1>
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
            value={editSlug}
            readOnly
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
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