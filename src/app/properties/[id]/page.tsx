"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { propertyService } from "@/lib/services/property";
import { reviewService } from "@/lib/services/review";
import { bookingService } from "@/lib/services/booking";
import { useAuthStore } from "@/store/auth";
import { Property, Review } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Rating from "@/components/ui/Rating";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import PropertyMap from "@/components/property/PropertyMap";
import PropertyImageGallery from "@/components/property/PropertyImageGallery";

export default function PropertyDetailPage() {
  const params = useParams();
  const { user } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [bookingDate, setBookingDate] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const propertyId = params.id as string;

  useEffect(() => {
    const loadData = async () => {
      try {
        const propData = await propertyService.getById(propertyId);
        setProperty(propData.data || null);

        const reviewData = await reviewService.getByProperty(propertyId);
        setReviews(reviewData.data || []);
      } catch (err) {
        setError("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [propertyId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please login to review");
      return;
    }

    try {
      await reviewService.create({
        property: propertyId,
        rating: newReview.rating,
        comment: newReview.comment,
      });
      setSuccess("Review submitted successfully and is waiting for admin approval.");
      setNewReview({ rating: 5, comment: "" });

      // Reload reviews
      const reviewData = await reviewService.getByProperty(propertyId);
      setReviews(reviewData.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review");
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please login to book");
      return;
    }

    setIsBooking(true);
    try {
      await bookingService.create({
        property: propertyId,
        visitDate: bookingDate,
        type: "visit",
      });
      setSuccess("Booking created successfully!");
      setBookingDate("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  if (isLoading) return <LoadingSpinner fullPage />;
  if (!property) return <div className="container py-12 text-center">Property not found</div>;

  return (
    <div className="container py-12">
      {error && <Alert type="error" message={error} onClose={() => setError("")} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess("")} />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Images Gallery */}
          {property.images && property.images.length > 0 && (
            <PropertyImageGallery images={property.images} title={property.title} />
          )}

          {/* Details */}
          <Card className="mb-8">
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{property.title}</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600">Bedrooms</p>
                <p className="text-xl font-bold sm:text-2xl">{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-gray-600">Bathrooms</p>
                <p className="text-xl font-bold sm:text-2xl">{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-gray-600">Area</p>
                <p className="text-xl font-bold sm:text-2xl">{property.area} sqft</p>
              </div>
              <div>
                <p className="text-gray-600">Parking</p>
                <p className="text-xl font-bold sm:text-2xl">{property.parking || 0}</p>
              </div>
            </div>

            <h3 className="mb-2 text-lg font-bold sm:text-xl">Description</h3>
            <p className="mb-6 text-sm text-gray-600 sm:text-base">{property.description}</p>

            <h3 className="mb-2 text-lg font-bold sm:text-xl">Location</h3>
            <p className="text-sm text-gray-600 sm:text-base">
              {property.location.address}, {property.location.city}, {property.location.state}{" "}
              {property.location.country}
            </p>
            {property.location?.coordinates?.lat && property.location?.coordinates?.lng && (
              <div className="mt-4">
                <PropertyMap
                  lat={property.location.coordinates.lat}
                  lng={property.location.coordinates.lng}
                  title={property.title}
                />
              </div>
            )}
          </Card>

          {/* Reviews */}
          <Card className="mb-8">
            <h3 className="mb-6 text-xl font-bold sm:text-2xl">Reviews ({reviews.length})</h3>

            <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <h4 className="text-sm font-bold sm:text-base">Share your experience</h4>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                To write a review, stay on this property page and submit from the form below. Reviews appear on the homepage after admin approval.
              </p>
            </div>

            {user ? (
              <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="mb-4 font-bold text-sm sm:text-base">Leave a Review</h4>
                <div className="mb-4">
                  <label className="block mb-2">Rating</label>
                  <Rating
                    value={newReview.rating}
                    onChange={(value) => setNewReview({ ...newReview, rating: value })}
                  />
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Write your review..."
                  className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4"
                  rows={4}
                  required
                />
                <Button type="submit">Submit Review</Button>
              </form>
            ) : (
              <div className="mb-8 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950">
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">Please login first to submit your review.</p>
                <Link href="/auth/login">
                  <Button size="sm">Login to Write Review</Button>
                </Link>
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{review.user.name}</p>
                        <Rating value={review.rating} readOnly />
                      </div>
                      <p className="text-sm text-gray-600">{formatDate(review.createdAt)}</p>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-20 mb-8">
            <p className="mb-4 text-3xl font-bold text-primary sm:text-4xl">{formatCurrency(property.price)}</p>
            <p className="text-gray-600 mb-4">{property.purpose === "rent" ? "/month" : ""}</p>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="mb-2 text-sm font-bold sm:text-base">Agent</p>
              <p className="text-gray-600">{property.agent.name}</p>
              <p className="text-gray-600">{property.agent.phone}</p>
              <p className="text-gray-600">{property.agent.email}</p>
            </div>

            {user ? (
              <form onSubmit={handleBooking} className="space-y-3">
                <Input
                  type="date"
                  min={minDate}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full" isLoading={isBooking}>
                  Schedule Visit
                </Button>
              </form>
            ) : (
              <Link href="/auth/login">
                <Button className="w-full">Login to Book</Button>
              </Link>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
