"use client";

import { useEffect, useState } from "react";
import { blogService } from "@/lib/services/blog";
import { Blog } from "@/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await blogService.getAll();
        setBlogs(data.data || []);
      } catch (error) {
        console.error("Failed to load blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, []);

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : blogs.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">No blog posts yet</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <Link key={blog._id} href={`/blogs/${blog.slug}`}>
              <Card className="hover:shadow-lg cursor-pointer">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 text-primary hover:underline">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{blog.content}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{blog.author.name}</span>
                      <span>{formatDate(blog.createdAt)}</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
