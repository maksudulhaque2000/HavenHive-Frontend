"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/store/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import { toastEvents } from "@/components/ui/toast-events";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setSession } = useAuthStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  const rememberMe = watch("rememberMe");

  useEffect(() => {
    const savedEmail = window.localStorage.getItem("havenhive_demo_email");
    if (savedEmail) {
      setValue("email", savedEmail);
    }
  }, [setValue]);

  const fillDemoCredentials = (variant: "user" | "admin") => {
    const credentials =
      variant === "admin"
        ? { email: "admin@havenhive.com", password: "Admin@1234" }
        : { email: "demo@havenhive.com", password: "Demo@1234" };

    setValue("email", credentials.email);
    setValue("password", credentials.password);
    window.localStorage.setItem("havenhive_demo_email", credentials.email);
  };

  const onSubmit = async (values: LoginFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.login({ email: values.email, password: values.password });
      if (response.success && response.token && response.user) {
        setSession({ token: response.token, user: response.user });
        window.localStorage.setItem("havenhive_remember_me", String(Boolean(values.rememberMe)));
        toastEvents.emit({ type: "success", message: "Welcome back to HavenHive." });

        const redirectTarget = window.localStorage.getItem("havenhive_redirect_after_login") || "/";
        window.localStorage.removeItem("havenhive_redirect_after_login");
        router.replace(redirectTarget);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <span className="section-label mb-3">Secure Access</span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Login to HavenHive</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Continue to your personalized property dashboard.</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      <div className="grid grid-cols-2 gap-3">
        <Button type="button" variant="outline" leftIcon={<Sparkles className="h-4 w-4" />} onClick={() => fillDemoCredentials("user")}>
          Demo User Login
        </Button>
        <Button type="button" variant="outline" leftIcon={<Sparkles className="h-4 w-4" />} onClick={() => fillDemoCredentials("admin")}>
          Demo Admin Login
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          prefix={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          prefix={<Lock className="h-4 w-4" />}
          suffix={
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={errors.password?.message}
          {...register("password")}
        />

        <label className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-secondary" checked={rememberMe ?? false} {...register("rememberMe")} />
          Remember me on this device
        </label>

        <Button type="submit" fullWidth loading={isLoading}>
          Login
        </Button>
      </form>

      <div className="space-y-2 text-center text-sm text-slate-600 dark:text-slate-400">
        <Link href="/auth/forgot-password" className="block font-medium text-primary hover:underline">
          Forgot your password?
        </Link>
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </Card>
  );
}
