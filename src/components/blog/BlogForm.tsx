"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Upload, X } from "lucide-react";
import { blogService } from "@/lib/services/blog";
import { Blog } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toastEvents } from "@/components/ui/toast-events";

interface BlogFormProps {
  blog?: Blog;
  isEditing?: boolean;
}

export default function BlogForm({ blog, isEditing = false }: BlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle both string and object coverImage formats
  const getCoverImageUrl = (): string | null => {
    if (!blog?.coverImage) return null;
    if (typeof blog.coverImage === 'string') return blog.coverImage;
    if (typeof blog.coverImage === 'object' && 'url' in blog.coverImage) {
      return blog.coverImage.url;
    }
    return null;
  };

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(getCoverImageUrl());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    content: blog?.content || "",
    category: blog?.category || "",
    published: blog?.published || false,
  });
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title || !formData.title.trim() || formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }
    if (!formData.content || !formData.content.trim() || formData.content.trim().length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    }
    if (!formData.category || !formData.category.trim() || formData.category.trim().length < 2) {
      newErrors.category = "Category must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          coverImage: "Image size must be less than 5MB",
        }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          coverImage: "File must be an image",
        }));
        return;
      }

      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.coverImage) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.coverImage;
          return newErrors;
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toastEvents.emit({
        type: "error",
        message: "Please fix the errors in the form",
      });
      return;
    }

    setIsLoading(true);
    try {
      const payload = new FormData();
      
      // Ensure all required fields are present
      const title = formData.title?.trim();
      const content = formData.content?.trim();
      const category = formData.category?.trim();
      
      if (!title || !content || !category) {
        throw new Error("Please fill in all required fields");
      }
      
      payload.append("title", title);
      payload.append("content", content);
      payload.append("category", category);
      payload.append("published", String(formData.published || false));

      if (coverImageFile) {
        payload.append("coverImage", coverImageFile);
      }

      if (isEditing && blog?._id) {
        await blogService.update(blog._id, payload);
        toastEvents.emit({
          type: "success",
          message: "Blog post updated successfully!",
        });
      } else {
        await blogService.create(payload);
        toastEvents.emit({
          type: "success",
          message: "Blog post created successfully!",
        });
      }

      // Navigate back to blogs
      setTimeout(() => {
        router.push("/blogs");
        router.refresh();
      }, 500);
    } catch (error: any) {
      console.error("Blog submission error:", error);
      const message = error?.response?.data?.message || error?.message || (isEditing ? "Failed to update blog" : "Failed to create blog");
      toastEvents.emit({
        type: "error",
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 dark:from-slate-950 dark:to-slate-900 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Card className="border-0 shadow-lg">
          <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700 sm:px-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              {isEditing
                ? "Update your blog post and share your thoughts with the community."
                : "Share your thoughts and insights with our community."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Blog Title
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter blog title (minimum 3 characters)"
                className={errors.title ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.title && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title}
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Category
              </label>
              <Input
                id="category"
                name="category"
                type="text"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g., Real Estate, Travel, Lifestyle (minimum 2 characters)"
                className={errors.category ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.category && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {errors.category}
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cover Image</label>
              {coverImagePreview ? (
                <div className="relative mb-4 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                  <img src={coverImagePreview} alt="Cover preview" className="h-64 w-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-12 transition-colors hover:border-primary hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800">
                  <Upload className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                  <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    Click to upload cover image
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">PNG, JPG up to 5MB</p>
                  <input
                    type="file"
                    name="coverImage"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              {errors.coverImage && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {errors.coverImage}
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Blog Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Write your blog content here (minimum 20 characters)..."
                rows={12}
                className={`w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                  errors.content ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              />
              {errors.content && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  {errors.content}
                </div>
              )}
            </div>

            {/* Published Checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-slate-300 bg-white text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-offset-slate-900"
              />
              <label htmlFor="published" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Publish this blog post immediately
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-slate-200 pt-6 dark:border-slate-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  isEditing ? "Update Blog" : "Create Blog"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
