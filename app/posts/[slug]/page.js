import { notFound } from "next/navigation";
import Link from "next/link";

async function getPost(slug) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window === "undefined" ? "http://localhost:3000" : "");
  const res = await fetch(`${baseUrl}/api/posts/${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.post;
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return {};
  const desc = post.content.replace(/<[^>]+>/g, "").slice(0, 160);
  return {
    title: post.title,
    description: desc,
    openGraph: {
      title: post.title,
      description: desc,
      url: `/posts/${post.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: desc,
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = params;
  const post = await getPost(slug);
  if (!post) return notFound();

  return (
    <div className="max-w-5xl mx-auto p-0">
      <div className="bg-white rounded shadow p-8 mb-6 mt-4 w-full">
        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold mb-2 text-black leading-tight">
          {post.title}
        </h1>
        <div className="text-gray-700 text-xs mb-6">
          Published: {new Date(post.createdAt).toLocaleString()}
        </div>

        {/* ✅ Use Tailwind Typography + cleaned HTML */}
        <article dangerouslySetInnerHTML={{ __html: post.content }} />


      </div>
    </div>
  );
}
