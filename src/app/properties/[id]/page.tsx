"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
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
      setSuccess("Review submitted successfully!");
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
          {/* Images */}
          {property.images.length > 0 && (
            <div className="mb-8">
              <div className="relative mb-4 h-96 w-full overflow-hidden rounded-lg">
                <Image src={property.images[0].url} alt={property.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
              </div>
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {property.images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="relative h-20 w-full overflow-hidden rounded-lg">
                      <Image
                        src={img.url}
                        alt={`${property.title} ${idx + 2}`}
                        fill
                        sizes="25vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Details */}
          <Card className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{property.title}</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600">Bedrooms</p>
                <p className="text-2xl font-bold">{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-gray-600">Bathrooms</p>
                <p className="text-2xl font-bold">{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-gray-600">Area</p>
                <p className="text-2xl font-bold">{property.area} sqft</p>
              </div>
              <div>
                <p className="text-gray-600">Parking</p>
                <p className="text-2xl font-bold">{property.parking || 0}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2">Description</h3>
            <p className="text-gray-600 mb-6">{property.description}</p>

            <h3 className="text-xl font-bold mb-2">Location</h3>
            <p className="text-gray-600">
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
            <h3 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h3>

            {user && (
              <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold mb-4">Leave a Review</h4>
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
            <p className="text-primary text-4xl font-bold mb-4">{formatCurrency(property.price)}</p>
            <p className="text-gray-600 mb-4">{property.purpose === "rent" ? "/month" : ""}</p>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="font-bold mb-2">Agent</p>
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
