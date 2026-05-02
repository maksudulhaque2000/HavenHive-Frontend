"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { blogService } from "@/lib/services/blog";
import { Blog } from "@/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const data = await blogService.getBySlug(slug);
        setBlog(data.data || null);
      } catch (err) {
        setError("Failed to load blog post");
      } finally {
        setIsLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!blog || error)
    return (
      <div className="container py-12">
        <Card>
          <p className="text-center text-red-600">{error || "Blog post not found"}</p>
        </Card>
      </div>
    );

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/blogs" className="text-primary hover:underline mb-6 block">
          ← Back to Blog
        </Link>

        <article className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

          <div className="flex items-center gap-4 mb-8 pb-8 border-b text-gray-600">
            <span>{blog.author.name}</span>
            <span>•</span>
            <span>{formatDate(blog.createdAt)}</span>
            <span>•</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {blog.category}
            </span>
          </div>

          {blog.coverImage && (
            <div className="relative mb-8 h-96 w-full overflow-hidden rounded-lg">
              <Image src={blog.coverImage} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none whitespace-pre-wrap">
            {blog.content}
          </div>
        </article>
      </div>
    </div>
  );
}
