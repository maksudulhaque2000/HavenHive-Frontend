"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { reviewService } from "@/lib/services/review";
import { Review } from "@/types";

const fallbackTestimonials = [
  {
    quote: "HavenHive helped us shortlist the right home faster than any other platform we tried.",
    author: "Farzana & Imran",
    label: "Verified buyer",
  },
  {
    quote: "The booking flow and property details made it easy to compare options without friction.",
    author: "Mehedi Hasan",
    label: "Satisfied client",
  },
  {
    quote: "Their listings feel curated and the dashboard makes follow-up simple.",
    author: "Rita Das",
    label: "Returning customer",
  },
];

export default function TestimonialsSlider() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await reviewService.getApproved();
        setReviews(response.data || []);
      } catch {
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  useEffect(() => {
    const items = reviews.length > 0 ? reviews : fallbackTestimonials;
    if (items.length <= 1) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [reviews]);

  const items = useMemo(() => {
    if (reviews.length === 0) {
      return fallbackTestimonials.map((item) => ({
        id: item.author,
        quote: item.quote,
        author: item.author,
        label: item.label,
        rating: 5,
        propertyTitle: "Featured experience",
      }));
    }

    return reviews.map((review) => ({
      id: review._id || review.id || `${review.user?.name}-${review.createdAt}`,
      quote: review.comment,
      author: review.user?.name || "Verified user",
      label: review.property?.title || "Approved review",
      rating: review.rating,
      propertyTitle: review.property?.title || "Property",
    }));
  }, [reviews]);

  const current = items[activeIndex] || items[0];

  const goTo = (index: number) => setActiveIndex(index);
  const goPrev = () => setActiveIndex((currentIndex) => (currentIndex - 1 + items.length) % items.length);
  const goNext = () => setActiveIndex((currentIndex) => (currentIndex + 1) % items.length);

  if (isLoading) {
    return (
      <Card className="flex min-h-[280px] items-center justify-center">
        <LoadingSpinner />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white/95 p-0 shadow-sm dark:border-slate-800 dark:bg-slate-900/95">
      <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="bg-gradient-to-br from-primary via-slate-900 to-slate-950 px-8 py-10 text-white sm:px-10 sm:py-12">
          <Badge variant="warning" className="w-fit border-white/20 bg-white/10 text-white">
            Approved testimonials
          </Badge>
          <h3 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
            What clients say after approval
          </h3>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/75 sm:text-base">
            User-submitted reviews are moderated by the admin team and featured here only after approval.
          </p>

          <div className="mt-5">
            <Link href="/properties">
              <Button
                size="sm"
                className="rounded-full bg-white px-4 text-slate-900 hover:bg-slate-100"
              >
                Write a Review
              </Button>
            </Link>
            <p className="mt-2 text-xs text-white/70">
              Open any property and scroll to the Reviews section.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button variant="secondary" size="sm" onClick={goPrev} className="bg-white text-slate-900 hover:bg-slate-100">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="sm" onClick={goNext} className="bg-white text-slate-900 hover:bg-slate-100">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative px-6 py-8 sm:px-8 sm:py-10">
          <Quote className="absolute right-6 top-6 h-16 w-16 text-slate-200 dark:text-slate-800" />
          <div className="relative min-h-[220px]">
            <div className="transition-all duration-500 ease-out">
              <div className="space-y-5">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className={`h-4 w-4 ${index < current.rating ? "fill-current" : "text-slate-300 dark:text-slate-700"}`} />
                  ))}
                </div>
                <p className="max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300 sm:text-xl">
                  &ldquo;{current.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{current.author}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    {current.label}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${index === activeIndex ? "w-10 bg-primary" : "w-2.5 bg-slate-300 dark:bg-slate-700"}`}
                  aria-label={`Show testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}