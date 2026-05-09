"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Sparkles } from "lucide-react";
import { blogService } from "@/lib/services/blog";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { Blog } from "@/types";
import BlogCard from "@/components/blog/BlogCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";

export default function BlogsPage() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setIsLoading(true);
        const data = await blogService.getAll();
        let filteredBlogs = data.data || [];

        // Filter by search term
        if (debouncedSearch) {
          filteredBlogs = filteredBlogs.filter(
            (blog) =>
              blog.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              blog.content.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
              blog.category.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }

        setBlogs(filteredBlogs);
      } catch (error) {
        console.error("Failed to load blogs:", error);
        setBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadBlogs();
  }, [debouncedSearch]);

  const canCreateBlog = Boolean(user && (user.role === "admin" || user.role === "agent"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 sm:text-4xl">
              Blog
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Explore insights, tips, and stories from our community
            </p>
          </div>
          {canCreateBlog && (
            <Link href="/blogs/create">
              <Button
                size="lg"
                className="group relative overflow-hidden rounded-full border border-white/20 bg-gradient-to-r from-primary via-primary to-secondary px-6 text-sm font-semibold shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
                leftIcon={<Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />}
                rightIcon={<Sparkles className="h-4 w-4 opacity-80 transition-transform duration-300 group-hover:scale-110" />}
              >
                Write Blog
              </Button>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search blogs by title, content, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex min-h-96 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState
            title={searchTerm ? "No blogs found" : "No blogs yet"}
            description={
              searchTerm
                ? "Try adjusting your search terms"
                : "Be the first to share your thoughts and insights"
            }
            ctaLabel={canCreateBlog && !searchTerm ? "Start Writing" : undefined}
            ctaHref={canCreateBlog && !searchTerm ? "/blogs/create" : undefined}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                canEdit={canCreateBlog}
                onBlogDeleted={() => {
                  setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
