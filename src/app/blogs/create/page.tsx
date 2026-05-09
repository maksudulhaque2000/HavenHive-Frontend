"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/blog/BlogForm";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CreateBlogPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only allow admin and agent to create blogs
    if (!isLoading && (!user || (user.role !== "admin" && user.role !== "agent"))) {
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 100);
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || (user.role !== "admin" && user.role !== "agent")) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">Redirecting...</p>
          <LoadingSpinner size="sm" />
        </div>
      </div>
    );
  }

  return <BlogForm />;
}
