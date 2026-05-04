"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ArrowRight } from "lucide-react";
import { Blog } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatDate, getDisplayId, truncate } from "@/lib/utils";

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export default function BlogCard({ blog, featured = false }: BlogCardProps) {
  const blogId = getDisplayId(blog);
  const href = `/blogs/${blog.slug || blogId}`;

  return (
    <Card className={featured ? "overflow-hidden p-0 md:col-span-2 lg:col-span-3" : "overflow-hidden p-0"}>
      <Link href={href} className="grid h-full grid-cols-1 md:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-64 overflow-hidden bg-gradient-to-br from-primary/15 to-secondary/20">
          {blog.coverImage ? (
            <Image src={blog.coverImage} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <div className="flex h-full min-h-64 items-center justify-center text-primary">No cover image</div>
          )}
        </div>
        <div className="flex flex-col justify-between gap-4 p-5 sm:p-6">
          <div className="space-y-4">
            <Badge variant="info">{blog.category}</Badge>
            <h3 className={featured ? "text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl" : "text-xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl"}>
              {blog.title}
            </h3>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{truncate(blog.content, featured ? 220 : 140)}</p>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-secondary" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300">{blog.author?.name || "HavenHive Team"}</span>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span>Read more</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </Card>
  );
}
