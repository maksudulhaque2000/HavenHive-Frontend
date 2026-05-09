"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BlogForm from "@/components/blog/BlogForm";
import { useAuth } from "@/hooks/useAuth";
import { blogService } from "@/lib/services/blog";
import { Blog } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import { toastEvents } from "@/components/ui/toast-events";

export default function EditBlogPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only allow admin and agent to edit blogs
    if (!authLoading && (!user || (user.role !== "admin" && user.role !== "agent"))) {
      router.push("/auth/login");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const loadBlog = async () => {
      if (!blogId) {
        setError("Blog ID not found");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await blogService.getById(blogId);
        
        if (response?.data) {
          setBlog(response.data);
        } else {
          setError("Failed to load blog post");
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || "Failed to load blog post";
        setError(errorMessage);
        toastEvents.emit({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && user && blogId) {
      loadBlog();
    }
  }, [blogId, authLoading, user]);

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "agent")) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 dark:from-slate-950 dark:to-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card className="border border-red-200 dark:border-red-900">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Error</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
              <button
                onClick={() => router.push("/blogs")}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Back to Blogs
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 dark:from-slate-950 dark:to-slate-900 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Card>
            <div className="p-6 text-center">
              <p className="text-slate-600 dark:text-slate-400">Blog post not found</p>
              <button
                onClick={() => router.push("/blogs")}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Back to Blogs
              </button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return <BlogForm blog={blog} isEditing={true} />;
}
