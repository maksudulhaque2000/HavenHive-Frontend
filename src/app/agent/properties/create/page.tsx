"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { propertyService } from "@/lib/services/property";
import { useAuthStore } from "@/store/auth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

export default function CreatePropertyPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "apartment",
    purpose: "sale",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    address: "",
    city: "",
    state: "",
    country: "",
    amenities: "",
  });

  if (!user || (user.role !== "agent" && user.role !== "admin")) {
    return <div className="container py-12 text-center">Access Denied</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("type", formData.type);
      payload.append("purpose", formData.purpose);
      payload.append("price", formData.price);
      payload.append("area", formData.area);
      payload.append("bedrooms", formData.bedrooms);
      payload.append("bathrooms", formData.bathrooms);
      payload.append("parking", formData.parking);
      payload.append("location", JSON.stringify({
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      }));
      payload.append("amenities", JSON.stringify(formData.amenities.split(",")));

      await propertyService.create(payload);
      router.push("/agent/properties");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create property");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-3xl font-bold sm:text-4xl">Create New Property</h1>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <div>
              <label className="text-xs font-medium sm:text-sm">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Property Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Purpose</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg"
                >
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
              />
              <Input
                label="Area (sqft)"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
              />
              <Input
                label="Bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
              />
              <Input
                label="Parking"
                name="parking"
                type="number"
                value={formData.parking}
                onChange={handleChange}
              />
            </div>

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Amenities (comma-separated)"
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="Pool, Gym, Parking, Security"
            />

            <div className="flex gap-4">
              <Button type="submit" isLoading={isLoading}>
                Create Property
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
