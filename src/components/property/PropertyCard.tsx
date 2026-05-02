"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, BedDouble, Bath, Ruler, BadgeDollarSign } from "lucide-react";
import { Property } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { cn, formatCurrency, getDisplayId } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  href?: string;
  onWishlistToggle?: (propertyId: string) => void;
  wishlistActive?: boolean;
}

export default function PropertyCard({ property, href, onWishlistToggle, wishlistActive }: PropertyCardProps) {
  const propertyId = getDisplayId(property);
  const linkHref = href || `/properties/${property.slug || propertyId}`;
  const image = property.images?.[0]?.url;

  return (
    <Card className="group overflow-hidden p-0">
      <Link href={linkHref} className="block">
        <div className="relative h-56 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-56 items-center justify-center bg-gradient-to-br from-primary/15 to-secondary/25 text-primary">No image</div>
          )}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge variant={property.purpose === "rent" ? "info" : "success"}>{property.purpose}</Badge>
            {property.featured && <Badge variant="warning">Featured</Badge>}
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              onWishlistToggle?.(propertyId);
            }}
            className={cn(
              "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition",
              wishlistActive ? "border-secondary bg-secondary text-white" : "border-white/60 bg-white/80 text-slate-700 hover:bg-white"
            )}
          >
            <Heart className={cn("h-4 w-4", wishlistActive && "fill-current")} />
          </button>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-100">{property.title}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4" />
              <span>{property.location.city}, {property.location.state}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-primary">{formatCurrency(property.price)}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{property.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">
            <BedDouble className="h-4 w-4 text-secondary" />
            <span>{property.bedrooms ?? 0} Beds</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">
            <Bath className="h-4 w-4 text-secondary" />
            <span>{property.bathrooms ?? 0} Baths</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800/70">
            <Ruler className="h-4 w-4 text-secondary" />
            <span>{property.area} sqft</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{property.description}</p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <Link href={linkHref} className="block w-full">
            <Button variant="outline" fullWidth>
              <span className="flex items-center justify-center gap-2">
                <BadgeDollarSign className="h-4 w-4" />
                View Details
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
