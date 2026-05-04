"use client";

import { useState } from "react";
import { contactService } from "@/lib/services/contact";
import { useAuthStore } from "@/store/auth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

export default function ContactPage() {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await contactService.create(formData);
      setSuccess("Message sent successfully! We&apos;ll get back to you soon.");
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-16 lg:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl leading-tight mb-4">Contact Us</h1>
          <p className="text-base leading-8 text-slate-600 dark:text-slate-400">
            Have questions? We&apos;d love to hear from you. Send us a message!
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

        <Card className="sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your message here..."
                rows={6}
                className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-base text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:ring-primary/15 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
                required
              />
            </div>
            <Button type="submit" size="lg" fullWidth loading={isLoading}>
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
