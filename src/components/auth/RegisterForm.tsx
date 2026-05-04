"use client";

import { useState } from "react";
import Link from "next/link";
import { authService } from "@/lib/services/auth";
import { useAuthStore } from "@/store/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import { Eye, EyeOff, Mail, Lock, Phone, User, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toastEvents } from "@/components/ui/toast-events";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: z.string().trim().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include an uppercase letter")
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[^A-Za-z0-9]/, "Password must include a special character"),
    confirmPassword: z.string().min(8),
    phone: z.string().trim().optional(),
    termsAccepted: z.boolean().refine((value) => value, "You must accept the terms"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setSession } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      termsAccepted: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
      });

      if (response.success && response.token && response.user) {
        setSession({ token: response.token, user: response.user });
        toastEvents.emit({ type: "success", message: "Welcome to HavenHive. Your account is ready." });
        window.location.href = "/";
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-md space-y-6">
      <div className="text-center">
        <span className="section-label mb-3">Join HavenHive</span>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">Create your account</h1>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 sm:text-sm">Register to save properties, book visits, and manage your profile.</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          prefix={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />
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
          placeholder="Create a strong password"
          prefix={<Lock className="h-4 w-4" />}
          suffix={
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          helperText="Use uppercase, number, and symbol for best security."
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          placeholder="Repeat your password"
          prefix={<CheckCircle2 className="h-4 w-4" />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Input
          label="Phone (optional)"
          type="tel"
          placeholder="+1 (555) 000-0000"
          prefix={<Phone className="h-4 w-4" />}
          error={errors.phone?.message}
          {...register("phone")}
        />

        <label className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-secondary" {...register("termsAccepted")} />
          <span>I agree to the HavenHive Terms and Privacy Policy.</span>
        </label>
        {errors.termsAccepted && <p className="text-xs font-medium text-danger">{errors.termsAccepted.message}</p>}

        <Button type="submit" fullWidth loading={isLoading}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium text-primary hover:underline">
          Login here
        </Link>
      </p>
    </Card>
  );
}
