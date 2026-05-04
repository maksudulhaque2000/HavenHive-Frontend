"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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

  if (!user) return <LoadingSpinner fullPage />;

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold sm:text-4xl">My Profile</h1>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            />

            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div>
              <p className="mb-2 text-xs text-gray-600 sm:text-sm">Email Verification</p>
              <p className={`font-bold ${user.isVerified ? "text-green-600" : "text-red-600"}`}>
                {user.isVerified ? "✓ Verified" : "✕ Not Verified"}
              </p>
            </div>

            <Button type="submit" isLoading={isLoading}>
              Update Profile
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
