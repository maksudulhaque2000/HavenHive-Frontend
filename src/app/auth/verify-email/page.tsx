"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/store/auth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Input from "@/components/ui/Input";
import { toastEvents } from "@/components/ui/toast-events";

const verifyEmailSchema = z.object({
  token: z.string().trim().min(16, "Enter the verification token"),
});

type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { token: searchParams.get("token") || "" },
  });

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setValue("token", token);
    }
  }, [searchParams, setValue]);

  useEffect(() => {
    if (resendTimer <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(() => setResendTimer((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendTimer]);

  const onSubmit = async (values: VerifyEmailFormValues) => {
    setError("");
    setSuccess("");
    setIsVerifying(true);

    try {
      const response = await authService.verifyEmail(values.token);
      if (response.success) {
        setSuccess("Email verified successfully.");
        toastEvents.emit({ type: "success", message: "Your email has been verified." });
      } else {
        setError(response.message || "Failed to verify email");
      }
    } catch (caughtError: any) {
      setError(caughtError.response?.data?.message || "Failed to verify email");
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerification = async () => {
    setError("");
    setSuccess("");
    setIsResending(true);

    try {
      await authService.requestEmailVerification();
      setSuccess("Verification email sent! Check your inbox.");
      toastEvents.emit({ type: "success", message: "Verification email sent." });
      setResendTimer(60);
    } catch (caughtError: any) {
      setError(caughtError.response?.data?.message || "Failed to send verification email");
    } finally {
      setIsResending(false);
    }
  };

  if (!user) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-md">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">Please login first to verify your email.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Card className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <span className="section-label mb-3">Email Security</span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Verify email</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Complete verification to unlock your full HavenHive experience.</p>
        </div>

        {success && <Alert type="success" message={success} />}
        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        <Card variant="bordered" className="space-y-3">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">A verification link was sent to:</p>
          <p className="text-center text-base font-semibold text-slate-900 dark:text-slate-100">{user.email}</p>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            {user.isVerified ? "Your email is already verified." : "Use the token from your email or tap resend if you did not receive it."}
          </p>
        </Card>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Verification Token"
            placeholder="Paste token from verification email"
            prefix={<ShieldCheck className="h-4 w-4" />}
            error={errors.token?.message}
            {...register("token")}
          />
          <Button type="submit" fullWidth loading={isVerifying}>
            Verify Email
          </Button>
        </form>

        {!user.isVerified && (
          <Button type="button" variant="outline" fullWidth loading={isResending} onClick={resendVerification} disabled={resendTimer > 0}>
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Verification Email"}
          </Button>
        )}
      </Card>
    </div>
  );
}
