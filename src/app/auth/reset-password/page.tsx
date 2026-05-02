"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/lib/services/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import { toastEvents } from "@/components/ui/toast-events";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid password reset link");
    }
  }, [token]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await authService.resetPassword(token, values.password);
      if (response.success) {
        setSuccess("Password reset successfully! Redirecting to login...");
        toastEvents.emit({ type: "success", message: "Password reset successfully." });
        setTimeout(() => {
          router.push("/auth/login");
        }, 1800);
      } else {
        setError(response.message || "Failed to reset password");
      }
    } catch (caughtError: any) {
      setError(caughtError.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-md">
          <Alert type="error" message="Invalid password reset link" />
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Card className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <span className="section-label mb-3">Reset Access</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Reset password</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Choose a new password for your account.</p>
        </div>

        {success && <Alert type="success" message={success} />}
        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a new password"
            prefix={<Lock className="h-4 w-4" />}
            suffix={
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm New Password"
            type={showPassword ? "text" : "password"}
            placeholder="Repeat the new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button type="submit" fullWidth loading={isLoading}>
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
