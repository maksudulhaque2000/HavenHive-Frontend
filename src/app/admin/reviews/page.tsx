"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageSquareQuote, Star } from "lucide-react";
import PrivateRoute from "@/components/layout/PrivateRoute";
import DashboardShell from "@/components/layout/DashboardShell";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Badge from "@/components/ui/Badge";
import { adminMenu } from "@/components/admin/adminMenu";
import { reviewService } from "@/lib/services/review";
import { Review } from "@/types";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await reviewService.getPending();
      setReviews(response.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to load pending reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      setActionLoading(reviewId);
      setError("");
      await reviewService.approve(reviewId);
      setSuccess("Review approved successfully");
      await loadReviews();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to approve review");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) return <LoadingSpinner fullPage />;

  return (
    <PrivateRoute roles={["admin"]}>
      <DashboardShell title="Review Moderation" subtitle="Approve submitted testimonials before they appear on the homepage." menu={adminMenu}>
        <div className="space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError("")} />}
          {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

          {reviews.length === 0 ? (
            <Card className="py-14 text-center">
              <MessageSquareQuote className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
              <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-slate-100">No pending reviews</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Approved testimonials will appear on the homepage slider.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {reviews.map((review) => (
                <Card key={review._id} className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="warning">Pending</Badge>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{review.property?.title || "Property"}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{review.user?.name || "Anonymous user"}</h3>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className={`h-4 w-4 ${index < review.rating ? "fill-current" : "text-slate-300 dark:text-slate-700"}`} />
                        ))}
                      </div>
                      <p className="max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">{review.comment}</p>
                    </div>

                    <Button
                      onClick={() => handleApprove(review._id || review.id || "")}
                      isLoading={actionLoading === (review._id || review.id || "")}
                      leftIcon={<CheckCircle2 className="h-4 w-4" />}
                      className="whitespace-nowrap"
                    >
                      Approve
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardShell>
    </PrivateRoute>
  );
}