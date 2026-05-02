"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { propertyService } from "@/lib/services/property";
import { userService } from "@/lib/services/user";
import { useAuth } from "@/hooks/useAuth";
import { useDebounce } from "@/hooks/useDebounce";
import { Property } from "@/types";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import PropertyCard from "@/components/property/PropertyCard";
import { SelectOption } from "@/types";

const propertyTypes: SelectOption[] = [
  { label: "All Types", value: "" },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Land", value: "land" },
  { label: "Commercial", value: "commercial" },
  { label: "Office", value: "office" },
  { label: "Other", value: "other" },
];

const sortOptions: SelectOption[] = [
  { label: "Newest first", value: "-createdAt" },
  { label: "Price low to high", value: "price" },
  { label: "Price high to low", value: "-price" },
  { label: "Area high to low", value: "-area" },
];

export default function PropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    purpose: "",
    city: "",
    state: "",
    minPrice: "",
    maxPrice: "",
    featured: "",
    sort: "-createdAt",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const queryParams = useMemo(() => ({
    page,
    limit: 9,
    search: debouncedSearch,
    type: filters.type,
    purpose: filters.purpose,
    city: filters.city,
    state: filters.state,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    featured: filters.featured,
    sort: filters.sort,
  }), [debouncedSearch, filters.city, filters.featured, filters.maxPrice, filters.minPrice, filters.purpose, filters.sort, filters.state, filters.type, page]);

  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      try {
        const response = await propertyService.getAll(queryParams);
        setProperties(response.data || []);
        setTotalPages(response.totalPages || response.pages || 1);
      } catch {
        setProperties([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, [queryParams]);

  useEffect(() => {
    // ensure wishlist active states follow user
    // no-op here: parent components will pass handlers
  }, [user?.wishlist]);

  const handleWishlistToggle = async (propertyId: string) => {
    try {
      await userService.toggleWishlist(propertyId);
      // optimistic UI: if user exists, update local copy
      // backend returns updated user but we rely on global auth store elsewhere
    } catch (err) {
      // ignore errors for now
    }
  };

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setPage(1);
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-8 py-8">
      <section className="container space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <span className="section-label">Explore</span>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">Find the right property</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">Search by location, price, and property type to narrow your shortlist quickly.</p>
          </div>
          {user?.role === "agent" || user?.role === "admin" ? (
            <Link href="/agent/properties/create">
              <Button leftIcon={<SlidersHorizontal className="h-4 w-4" />}>Add Property</Button>
            </Link>
          ) : null}
        </div>

        <Card className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-4">
            <Input
              label="Search"
              placeholder="Search title, description, city..."
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              prefix={<Search className="h-4 w-4" />}
            />
            <Input
              label="City"
              placeholder="Dhaka"
              value={filters.city}
              onChange={(event) => updateFilter("city", event.target.value)}
              prefix={<Filter className="h-4 w-4" />}
            />
            <Input
              label="State"
              placeholder="Dhaka Division"
              value={filters.state}
              onChange={(event) => updateFilter("state", event.target.value)}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Type</label>
              <select
                value={filters.type}
                onChange={(event) => updateFilter("type", event.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value || "all-types"} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Purpose</label>
              <select
                value={filters.purpose}
                onChange={(event) => updateFilter("purpose", event.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">All purpose</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <Input
              label="Minimum price"
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(event) => updateFilter("minPrice", event.target.value)}
            />
            <Input
              label="Maximum price"
              type="number"
              placeholder="1000000"
              value={filters.maxPrice}
              onChange={(event) => updateFilter("maxPrice", event.target.value)}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Sort by</label>
              <select
                value={filters.sort}
                onChange={(event) => updateFilter("sort", event.target.value)}
                className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </section>

      <section className="container space-y-4">
        {isLoading ? (
          <LoadingSpinner />
        ) : properties.length > 0 ? (
          <>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {properties.map((property) => (
                <PropertyCard
                  key={property.slug || property._id}
                  property={property}
                  onWishlistToggle={handleWishlistToggle}
                  wishlistActive={user?.wishlist?.includes(property._id || property.id || "")}
                />
              ))}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState
            title="No properties found"
            description="Adjust your filters or clear search terms to explore more listings."
            ctaLabel="Reset filters"
            ctaHref="/properties"
          />
        )}
      </section>
    </div>
  );
}
