"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { propertyService } from "@/lib/services/property";
import { Property } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { getDisplayId } from "@/lib/utils";

export default function AgentPropertiesPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || (user.role !== "agent" && user.role !== "admin")) {
      router.push("/");
      return;
    }

    const loadProperties = async () => {
      try {
        const data = await propertyService.getAll({ agent: user._id });
        setProperties(data.data || []);
      } catch (err) {
        setError("Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [user, router]);

  if (!user || (user.role !== "agent" && user.role !== "admin")) {
    return <div className="container py-12 text-center">Access Denied</div>;
  }

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await propertyService.delete(propertyId);
      setProperties(properties.filter((p) => p._id !== propertyId));
    } catch (err) {
      setError("Failed to delete property");
    }
  };

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Properties</h1>
        <Link href="/agent/properties/create">
          <Button>Add New Property</Button>
        </Link>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError("")} />}

      {isLoading ? (
        <LoadingSpinner fullPage />
      ) : properties.length === 0 ? (
        <Card>
          <p className="text-center text-gray-600 py-8">No properties listed yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {properties.map((property) => (
            <Card key={property._id}>
              <div className="flex gap-4">
                {property.images[0] && (
                  <img
                    src={property.images[0].url}
                    alt={property.title}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                  <p className="text-primary text-2xl font-bold mb-2">
                    {formatCurrency(property.price)}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    {property.bedrooms} beds • {property.bathrooms} baths • {property.area} sqft
                  </p>
                  <div className="flex gap-2">
                    <Link href={`/properties/${property._id}`}>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                    <Link href={`/agent/properties/${property._id}/edit`}>
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        const displayId = property._id || property.id || getDisplayId(property);
                        if (displayId) {
                          handleDelete(displayId);
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
