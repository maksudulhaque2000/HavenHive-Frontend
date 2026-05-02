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
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center mb-8">
          Have questions? We&apos;d love to hear from you. Send us a message!
        </p>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}
        {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Your message here..."
                rows={6}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary"
                required
              />
            </div>
            <Button type="submit" className="w-full" isLoading={isLoading}>
              Send Message
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
