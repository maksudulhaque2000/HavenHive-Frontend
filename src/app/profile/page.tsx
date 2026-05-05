"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/auth";
import { userService } from "@/lib/services/user";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }
    setFormData({ name: user.name ?? "", phone: user.phone ?? "" });
    if (typeof user.avatar === "object" && user.avatar?.url) {
      setPreviewUrl(user.avatar.url);
    } else if (typeof user.avatar === "string") {
      setPreviewUrl(user.avatar);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const updatedUser = await userService.updateProfile(formData);
      if (updatedUser.data) {
        setUser(updatedUser.data);
        setSuccess("Profile updated successfully!");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload avatar
    setError("");
    setSuccess("");
    setIsUploadingAvatar(true);

    try {
      const updatedUser = await userService.uploadProfilePicture(file);
      if (updatedUser.data) {
        setUser(updatedUser.data);
        setSuccess("Profile picture updated successfully!");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to upload profile picture");
      setPreviewUrl(
        typeof user?.avatar === "object" && user?.avatar?.url
          ? user.avatar.url
          : typeof user?.avatar === "string"
            ? user.avatar
            : null
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (!user) return <LoadingSpinner fullPage />;

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold sm:text-4xl">My Profile</h1>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Profile Picture</h2>
              
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Profile preview"
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-slate-400 dark:text-slate-500">
                        {user.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center">
                      <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      disabled={isUploadingAvatar}
                      className="hidden"
                      id="avatar-input"
                    />
                    <label
                      htmlFor="avatar-input"
                      className="inline-flex cursor-pointer rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {isUploadingAvatar ? "Uploading..." : "Choose Image"}
                    </label>
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 sm:text-sm">Email</p>
                  <p className="font-bold">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 sm:text-sm">Role</p>
                  <p className="font-bold capitalize">{user.role}</p>
                </div>
              </div>

              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-6"
              />

              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-4"
              />

              <div className="mt-6">
                <p className="mb-2 text-xs text-gray-600 sm:text-sm">Email Verification</p>
                <p className={`font-bold ${user.isVerified ? "text-green-600" : "text-red-600"}`}>
                  {user.isVerified ? "✓ Verified" : "✕ Not Verified"}
                </p>
              </div>

              <Button type="submit" isLoading={isLoading} className="mt-6">
                Update Profile
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
