// Auth Types
export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: "user" | "agent" | "admin";
  phone?: string;
  avatar?: string | { url: string; publicId?: string };
  avatarPublicId?: string;
  isVerified: boolean;
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
  verificationToken?: string;
}

export interface AuthSession {
  token: string;
  user: User;
  expiresAt?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  confirmPassword?: string;
  termsAccepted?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Property Types
export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyImage {
  url: string;
  publicId: string;
}

export interface Property {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  description: string;
  type: "apartment" | "house" | "villa" | "land" | "commercial" | "office" | "other";
  purpose: "sale" | "rent";
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  amenities: string[];
  location: Location;
  images: PropertyImage[];
  status: "draft" | "published" | "sold" | "rented" | "archived";
  featured: boolean;
  views: number;
  agent: User;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Booking Types
export interface Booking {
  id?: string;
  _id?: string;
  property: Property;
  user: User;
  agent: User;
  visitDate: string;
  type: "visit" | "call" | "online";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  id?: string;
  _id?: string;
  property: Property;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Blog Types
export interface Blog {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  author: User;
  published: boolean;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact Types
export interface Contact {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "in-progress" | "resolved";
  user?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  user?: User;
  wishlist?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
  pages?: number;
  totalPages?: number;
}

export interface StatsResponse {
  total: number;
  published?: number;
  draft?: number;
  sold?: number;
  rented?: number;
  featured?: number;
}

export interface DashboardStats {
  totalBookings?: number;
  pendingBookings?: number;
  wishlistCount?: number;
  reviewsWritten?: number;
  totalProperties?: number;
  totalUsers?: number;
  totalReviews?: number;
  newMessages?: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface SelectOption {
  label: string;
  value: string;
}
