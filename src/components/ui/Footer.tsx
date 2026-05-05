"use client";

import Link from "next/link";
import { Github, Linkedin, Facebook, Instagram, Youtube, Music, MessageCircle, Twitter, Globe } from "lucide-react";

const socialLinks = [
  {
    name: "Portfolio",
    href: "https://maksudul-haque.vercel.app",
    icon: Globe,
    label: "Portfolio",
  },
  {
    name: "GitHub",
    href: "https://github.com/maksudulhaque2000",
    icon: Github,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/maksudulhaque2000",
    icon: Linkedin,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/maksudulhaque2000",
    icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/maksudulhaque2000",
    icon: Instagram,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@maksudulhaque2000",
    icon: Youtube,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@maksudulhaque2000",
    icon: Music,
  },
  {
    name: "Threads",
    href: "https://www.threads.net/@maksudulhaque2000",
    icon: MessageCircle,
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/smmaksudulhaque",
    icon: Twitter,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
      <div className="container py-12">
        {/* Main Footer Content */}
        <div className="grid gap-12 md:grid-cols-4">
          {/* Branding Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-sm font-black text-white">
                HH
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">HavenHive</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your premier destination for finding the perfect property and managing real estate with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: "Properties", href: "/properties" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Blogs", href: "/blogs" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Support</h4>
            <ul className="space-y-2">
              {[
                { label: "FAQ", href: "#" },
                { label: "Support Center", href: "#" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 transition-colors hover:text-primary dark:text-slate-400 dark:hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">Get In Touch</h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <p>Email:</p>
                <a
                  href="mailto:support@havenhive.com"
                  className="font-medium text-slate-900 hover:text-primary dark:text-slate-100 dark:hover:text-primary"
                >
                  support@havenhive.com
                </a>
              </li>
              <li>
                <p>Phone:</p>
                <a
                  href="tel:+1234567890"
                  className="font-medium text-slate-900 hover:text-primary dark:text-slate-100 dark:hover:text-primary"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-200 dark:border-slate-800" />

        {/* Social Links & Copyright */}
        <div className="space-y-6">
          {/* Social Links Section */}
          <div className="space-y-4">
            <h4 className="text-center font-bold text-slate-900 dark:text-slate-100">Connect With Developer</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return social.icon ? (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-all hover:border-primary hover:bg-primary hover:text-white dark:border-slate-700 dark:text-slate-400 dark:hover:bg-primary dark:hover:text-white"
                    title={social.name}
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ) : (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-primary hover:bg-primary hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-primary dark:hover:text-white"
                  >
                    {social.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-200 pt-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            <p>&copy; 2026 HavenHive. All rights reserved.</p>
            <p className="mt-2">
              Developed with ❤️ by{" "}
              <a
                href="https://maksudul-haque.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-secondary dark:hover:text-secondary"
              >
                Maksudule Haque
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
