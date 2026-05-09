"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowRight, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Blog } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { cn, formatDate, getDisplayId, truncate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { blogService } from "@/lib/services/blog";
import { toastEvents } from "@/components/ui/toast-events";
import { useRouter } from "next/navigation";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
  canEdit?: boolean;
  onBlogDeleted?: () => void;
}

export default function BlogCard({ blog, featured = false, canEdit = false, onBlogDeleted }: BlogCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const blogId = getDisplayId(blog);
  const href = `/blogs/${blog.slug || blogId}`;
  
  const isAuthor = user?._id === blog.author?._id;
  const isAdmin = user?.role === "admin";
  const canManage = canEdit && (isAuthor || isAdmin);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await blogService.delete(blogId);
      toastEvents.emit({
        type: "success",
        message: "Blog post deleted successfully",
      });
      setShowDeleteDialog(false);
      if (onBlogDeleted) {
        onBlogDeleted();
      } else {
        router.refresh();
      }
    } catch (error) {
      toastEvents.emit({
        type: "error",
        message: "Failed to delete blog post",
      });
      setShowDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/blogs/edit/${blogId}`);
  };

  const coverImageUrl =
    blog.coverImage && typeof blog.coverImage === "string"
      ? blog.coverImage
      : blog.coverImage && typeof blog.coverImage === "object"
        ? blog.coverImage.url
        : null;

  return (
    <>
      <Card
        variant="elevated"
        className={cn(
          "group relative overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
          featured ? "md:col-span-2 lg:col-span-3" : ""
        )}
      >
        <Link
          href={href}
          className={cn(
            "grid h-full grid-cols-1 overflow-hidden",
            featured ? "md:grid-cols-[1.1fr_0.9fr]" : ""
          )}
        >
          <div className={cn("relative overflow-hidden bg-gradient-to-br from-primary/15 via-white to-secondary/20 dark:from-primary/10 dark:via-slate-900 dark:to-secondary/10", featured ? "min-h-52 md:min-h-full" : "h-52") }>
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={blog.title}
                fill
                sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-medium text-primary/80">
                No cover image
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent" />

            <div className="absolute left-4 top-4 flex items-center gap-2">
              <Badge variant="info" className="rounded-full border border-white/20 bg-white/90 text-xs font-bold uppercase tracking-[0.2em] text-slate-800 shadow-sm backdrop-blur dark:bg-slate-950/80 dark:text-slate-100">
                {blog.category}
              </Badge>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
              <div>
                <div className="mb-1 flex items-center gap-2 text-xs text-white/80">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
                <p className="text-sm font-semibold text-white/90">{blog.author?.name || "HavenHive Team"}</p>
              </div>

              {!featured && (
                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  Blog
                </div>
              )}
            </div>
          </div>

          <div className={cn("flex h-full flex-col justify-between gap-4 p-4 sm:p-5", featured ? "sm:p-6" : "")}>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Featured insight
              </div>

              <h3
                className={cn(
                  "font-black tracking-tight text-slate-900 dark:text-slate-100 line-clamp-2",
                  featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-[1.35rem]"
                )}
              >
                {blog.title}
              </h3>

              <p className={cn("text-sm leading-6 text-slate-600 dark:text-slate-400", featured ? "line-clamp-4" : "line-clamp-3")}>
                {truncate(blog.content, featured ? 180 : 120)}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {blog.author?.name || "HavenHive Team"}
              </span>

              {canManage ? (
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
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                    leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                    className="h-10 rounded-xl border border-transparent bg-gradient-to-r from-rose-500 to-rose-600 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:from-rose-600 hover:to-rose-700 hover:shadow-lg hover:shadow-rose-500/20"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <span>Read more</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              )}
            </div>
          </div>
        </Link>
      </Card>

      {/* Fancy Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Blog Post"
        message="Are you sure you want to delete this blog post? This action cannot be undone and the blog will be permanently removed from the system."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        danger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
