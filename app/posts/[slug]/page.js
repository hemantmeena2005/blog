import { notFound } from "next/navigation";
import Link from "next/link";

// Always fetch fresh data (no caching) in a dynamic page
const FETCH_OPTIONS = { cache: "no-store" };

// Use production Vercel URL for fetch
async function getPost(slug) {
  const baseUrl = `https://blog-six-lilac-47.vercel.app`;
  const res = await fetch(`${baseUrl}/api/posts/${slug}`, FETCH_OPTIONS);
  if (!res.ok) return null;
  const data = await res.json();
  return data.post;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
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
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return notFound();

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-8 mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-extrabold mb-2 text-black leading-tight">
          {post.title}
        </h1>
        <p className="text-gray-600 text-xs mb-6">
          Published: {new Date(post.createdAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        <article
          className="prose prose-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </div>
  );
}
