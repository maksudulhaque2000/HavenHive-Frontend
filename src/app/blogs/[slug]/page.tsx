"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";
import { blogService } from "@/lib/services/blog";
import { Blog } from "@/types";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { toastEvents } from "@/components/ui/toast-events";

export default function BlogDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const coverImageUrl =
    blog?.coverImage && typeof blog.coverImage === "string"
      ? blog.coverImage
      : blog?.coverImage && typeof blog.coverImage === "object"
        ? blog.coverImage.url
        : null;

  const userId = user?._id || user?.id;
  const authorId = blog?.author?._id || blog?.author?.id;
  const isAuthor = Boolean(userId && authorId && userId === authorId);
  const isAdmin = user?.role === "admin";
  const canManage = Boolean(blog && user && (isAdmin || isAuthor));

  const handleEdit = () => {
    if (!blog?._id) return;
    router.push(`/blogs/edit/${blog._id}`);
  };

  const handleDelete = async () => {
    if (!blog?._id) return;

    setIsDeleting(true);
    try {
      await blogService.delete(blog._id);
      toastEvents.emit({
        type: "success",
        message: "Blog post deleted successfully",
      });
      router.push("/blogs");
      router.refresh();
    } catch (err: any) {
      const message = err?.response?.data?.message || "Failed to delete blog post";
      toastEvents.emit({
        type: "error",
        message,
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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

        <article className="rounded-lg bg-white p-6 shadow-md sm:p-8">
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-3xl font-bold sm:text-4xl">{blog.title}</h1>

            {canManage && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-1.5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEdit}
                  leftIcon={<Edit className="h-3.5 w-3.5" />}
                  className="h-10 rounded-xl border-slate-200 bg-slate-50 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-700 shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                  leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                  className="h-10 rounded-xl border border-transparent bg-gradient-to-r from-rose-500 to-rose-600 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-rose-600 hover:to-rose-700 hover:shadow-lg hover:shadow-rose-500/20"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            )}
          </div>

          <div className="mb-8 flex items-center gap-3 border-b pb-8 text-sm text-gray-600 sm:gap-4 sm:text-base">
            <span>{blog.author.name}</span>
            <span>•</span>
            <span>{formatDate(blog.createdAt)}</span>
            <span>•</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {blog.category}
            </span>
          </div>

          {coverImageUrl && (
            <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg sm:h-80 lg:h-96">
              <Image src={coverImageUrl} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
            </div>
          )}

          <div className="prose prose-sm max-w-none whitespace-pre-wrap sm:prose-lg">
            {blog.content}
          </div>
        </article>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
