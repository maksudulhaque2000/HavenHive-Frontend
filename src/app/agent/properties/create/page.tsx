"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { propertyService } from "@/lib/services/property";
import { useAuthStore } from "@/store/auth";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

type ImageItem = {
  file: File;
  preview: string;
};

export default function CreatePropertyPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<ImageItem[]>([]);
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

  useEffect(() => {
    return () => {
      images.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [images]);

  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      const image = new window.Image();

      image.onload = () => {
        const maxWidth = 1920;
        const maxHeight = 1080;
        const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
        const width = Math.round(image.width * ratio);
        const height = Math.round(image.height * ratio);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          resolve(file);
          return;
        }

        ctx.drawImage(image, 0, 0, width, height);
        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        const quality = outputType === "image/png" ? undefined : 0.82;

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              resolve(file);
              return;
            }

            const fileName = file.name.replace(/\.(png|jpg|jpeg|webp)$/i, outputType === "image/png" ? ".png" : ".jpg");
            resolve(new File([blob], fileName, { type: outputType, lastModified: Date.now() }));
          },
          outputType,
          quality
        );
      };

      image.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      image.src = objectUrl;
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const validFiles = selectedFiles.filter((file) => allowedTypes.includes(file.type));
    if (validFiles.length !== selectedFiles.length) {
      setError("Only JPG, PNG and WEBP images are allowed");
      return;
    }

    if (validFiles.some((file) => file.size > 10 * 1024 * 1024)) {
      setError("Each image must be smaller than 10MB");
      return;
    }

    const remainingSlots = 10 - images.length;
    if (remainingSlots <= 0) {
      setError("You can upload up to 10 images only");
      return;
    }

    const filesToProcess = validFiles.slice(0, remainingSlots);
    const optimizedFiles = await Promise.all(filesToProcess.map((file) => optimizeImage(file)));
    const newItems = optimizedFiles.map((file) => ({ file, preview: URL.createObjectURL(file) }));

    setImages((prev) => [...prev, ...newItems]);
    setError("");
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return next;
    });
  };

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
      payload.append("amenities", JSON.stringify(formData.amenities.split(",").map((item) => item.trim()).filter(Boolean)));

      images.forEach((item) => {
        payload.append("images", item.file);
      });

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

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Property Images</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm font-medium text-slate-700 transition hover:border-primary hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                <Upload className="h-4 w-4" />
                Upload one or more images (max 10)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">Images are optimized automatically before upload and stored in Cloudinary as optimized assets.</p>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((item, index) => (
                    <div key={`${item.file.name}-${index}`} className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="relative h-28 w-full">
                        <Image
                          src={item.preview}
                          alt={`Property upload ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 50vw, 20vw"
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-black/65 p-1 text-white hover:bg-black/80"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

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
