"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/lib/services/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import { toastEvents } from "@/components/ui/toast-events";

const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await authService.forgotPassword(values.email);
      setSuccess("Password reset link sent to your email");
      toastEvents.emit({ type: "success", message: "Password reset link sent to your inbox." });
      reset();
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <span className="section-label mb-3">Password Help</span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">We&apos;ll send a reset link to your email address.</p>
      </div>

      {success && <Alert type="success" message={success} />}
      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          helperText="We&apos;ll send a password reset link to this email"
          prefix={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Button type="submit" fullWidth loading={isLoading}>
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Remember your password?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Login here
        </Link>
      </p>
    </Card>
  );
}
