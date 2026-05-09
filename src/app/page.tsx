"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Compass, Home, KeyRound, Mail, MapPinned, PlayCircle, Search, Sparkles, Phone, Globe, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { propertyService } from "@/lib/services/property";
import { blogService } from "@/lib/services/blog";
import { Blog, Property, StatsResponse } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import PropertyCard from "@/components/property/PropertyCard";
import BlogCard from "@/components/blog/BlogCard";
import { formatNumber } from "@/lib/utils";

const categories = [
  { label: "Apartments", href: "/properties?type=apartment", icon: Building2 },
  { label: "Villas", href: "/properties?type=villa", icon: Home },
  { label: "Rentals", href: "/properties?purpose=rent", icon: Compass },
  { label: "Commercial", href: "/properties?type=commercial", icon: MapPinned },
];

const howItWorks = [
  {
    title: "Search with intent",
    description: "Filter by city, budget, type, and purpose to find homes that fit your lifestyle.",
    icon: Search,
  },
  {
    title: "Book a visit",
    description: "Choose a date and visit type to schedule a showing with the assigned agent.",
    icon: KeyRound,
  },
  {
    title: "Move with confidence",
    description: "Track your bookings, favorites, and reviews from your personal dashboard.",
    icon: BadgeCheck,
  },
];

const agents = [
  {
    name: "Ariana Rahman",
    role: "Senior Property Advisor",
    experience: "8 years",
    area: "Dhaka & Chattogram",
    email: "ariana@havenhive.com",
    phone: "+880 1711-204811",
    responseTime: "Replies within 2 hours",
    specialties: ["Family Homes", "City Apartments"],
    languages: ["Bangla", "English"],
    rating: "4.9/5",
  },
  {
    name: "Noman Chowdhury",
    role: "Investment Specialist",
    experience: "6 years",
    area: "Residential Portfolios",
    email: "noman@havenhive.com",
    phone: "+880 1711-204812",
    responseTime: "Replies within 3 hours",
    specialties: ["ROI Strategy", "Portfolio Growth"],
    languages: ["Bangla", "English"],
    rating: "4.8/5",
  },
  {
    name: "Maya Islam",
    role: "Luxury Homes Consultant",
    experience: "7 years",
    area: "Premium Villas",
    email: "maya@havenhive.com",
    phone: "+880 1711-204813",
    responseTime: "Replies within 1 hour",
    specialties: ["Luxury Villas", "Private Estates"],
    languages: ["Bangla", "English", "Hindi"],
    rating: "5.0/5",
  },
];

const testimonials = [
  {
    quote: "HavenHive helped us shortlist the right home faster than any other platform we tried.",
    author: "Farzana & Imran",
  },
  {
    quote: "The booking flow and property details made it easy to compare options without friction.",
    author: "Mehedi Hasan",
  },
  {
    quote: "Their listings feel curated and the dashboard makes follow-up simple.",
    author: "Rita Das",
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, featured: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [featuredResponse, blogResponse, statsResponse] = await Promise.all([
          propertyService.getFeatured(),
          blogService.getAll(),
          propertyService.getStats(),
        ]);

        setFeatured(featuredResponse.data || []);
        setLatestBlogs((blogResponse.data || []).slice(0, 3));
        const statsData: Partial<StatsResponse> = statsResponse.data || {};
        setStats({
          total: statsData.total ?? 0,
          published: statsData.published ?? 0,
          draft: statsData.draft ?? 0,
          featured: statsData.featured ?? 0,
        });
      } catch {
        setFeatured([]);
        setLatestBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="space-y-32 pb-20">
      <section className="container pt-12 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-10">
            <Badge variant="warning" className="w-fit">Trusted real estate marketplace</Badge>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 text-balance dark:text-slate-100 sm:text-5xl lg:text-6xl leading-tight">
                Find the home, investment, or rental that feels right.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
                HavenHive brings curated property listings, agent-backed support, and transparent booking flows together in one premium marketplace.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/properties">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Explore Properties
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" leftIcon={<Mail className="h-5 w-5" />}>
                  Contact an Agent
                </Button>
              </Link>
            </div>
            {/* Search Widget */}
            <div className="mt-8">
              <SearchWidget />
            </div>
            <div className="grid gap-6 sm:grid-cols-3 pt-4">
              {[
                { label: "Live listings", value: stats.total || 1200 },
                { label: "Happy clients", value: 2800 },
                { label: "Verified agents", value: 45 },
              ].map((item) => (
                <Card key={item.label} variant="bordered" className="p-5 sm:p-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                  <p className="mt-3 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{formatNumber(item.value)}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="relative overflow-hidden p-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(199,162,75,0.2),_transparent_45%),linear-gradient(135deg,_rgba(20,50,79,0.97),_rgba(20,50,79,0.85))]" />
            <div className="relative p-8 text-white">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.24em] text-white/70">Featured insight</p>
                  <h2 className="mt-3 text-2xl font-black sm:text-3xl leading-tight">Smart search, real results</h2>
                </div>
                <PlayCircle className="h-10 w-10 text-secondary flex-shrink-0" />
              </div>

              <div className="space-y-5 rounded-3xl bg-white/10 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-secondary flex-shrink-0" />
                  <p className="text-sm font-semibold">Personalized recommendations</p>
                </div>
                <p className="text-sm leading-7 text-white/80">
                  Browse hand-picked apartments, villas, commercial spaces, and rental homes with filters that make it simple to narrow down the right fit.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-white/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">Featured</p>
                    <p className="mt-3 text-2xl font-black text-secondary">{formatNumber(stats.featured || featured.length || 0)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">Published</p>
                    <p className="mt-3 text-2xl font-black text-secondary">{formatNumber(stats.published || 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="container space-y-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="section-label">Browse by category</span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Popular property categories</h2>
          </div>
          <Link href="/properties" className="hidden text-sm font-semibold text-primary md:inline-flex">
            View all properties
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.label} href={category.href}>
                <Card className="group h-full transition-all duration-300 hover:shadow-md sm:p-7">
                  <Icon className="h-8 w-8 text-secondary transition group-hover:scale-110 sm:h-9 sm:w-9" />
                  <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">{category.label}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">Tailored collections to help you move quickly.</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container space-y-8">
        <div>
          <span className="section-label">Statistics</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Dynamic platform metrics</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total properties", value: stats.total || 0 },
            { label: "Published listings", value: stats.published || 0 },
            { label: "Draft listings", value: stats.draft || 0 },
            { label: "Featured homes", value: stats.featured || 0 },
          ].map((item) => (
            <Card key={item.label} className="sm:p-7">
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
              <p className="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-slate-100">{formatNumber(item.value)}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container space-y-8">
        <div>
          <span className="section-label">Featured listings</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Curated properties worth a closer look</h2>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : featured.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {featured.slice(0, 6).map((property) => (
              <PropertyCard key={property.slug || property._id} property={property} />
            ))}
          </div>
        ) : (
          <Card className="text-center text-slate-500 dark:text-slate-400 py-12">No featured properties available right now.</Card>
        )}
      </section>

      <section className="container space-y-8">
        <div>
          <span className="section-label">How it works</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">A simple path from search to move-in</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {howItWorks.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.title} className="space-y-5 sm:p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-sm sm:h-13 sm:w-13">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary">Step {index + 1}</p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">{step.title}</h3>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{step.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container space-y-8">
        <div>
          <span className="section-label">Agents</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Meet the people behind the listings</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {agents.map((agent, index) => {
            const initials = agent.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("");

            return (
              <Card key={agent.name} className="group overflow-hidden border border-slate-200 bg-white/95 p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/95">
                <div className="h-2 bg-gradient-to-r from-primary via-secondary to-amber-400" />
                <div className="space-y-5 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-black text-white shadow-sm dark:bg-slate-100 dark:text-slate-900">
                        {initials}
                      </div>
                      <div>
                        <div className="mb-1 flex items-center gap-2">
                          <Badge variant="warning" className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">
                            Agent {index + 1}
                          </Badge>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 sm:text-lg">{agent.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{agent.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      {agent.rating}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-950/50">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Experience</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{agent.experience}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 px-3 py-3 dark:bg-slate-950/50">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Focus</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{agent.area}</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-slate-950/50">
                      <Mail className="h-4 w-4 shrink-0 text-secondary" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-slate-950/50">
                      <Phone className="h-4 w-4 shrink-0 text-secondary" />
                      <span>{agent.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-slate-950/50">
                      <Sparkles className="h-4 w-4 shrink-0 text-secondary" />
                      <span>{agent.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {agent.specialties.slice(0, 2).map((specialty) => (
                      <span key={specialty} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        {specialty}
                      </span>
                    ))}
                    {agent.languages.slice(0, 2).map((language) => (
                      <span key={language} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        <Globe className="h-3.5 w-3.5" />
                        {language}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                    <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">{agent.area}</p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <BadgeCheck className="h-4 w-4" />
                      Verified
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="container space-y-8">
        <div>
          <span className="section-label">Testimonials</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">What clients say</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} className="space-y-5 sm:p-7">
              <p className="text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg sm:leading-8">&quot;{testimonial.quote}&quot;</p>
              <p className="text-sm font-semibold text-secondary">{testimonial.author}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="container space-y-8">
        <div>
          <span className="section-label">From the blog</span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">Latest market insight</h2>
        </div>
        {latestBlogs.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {latestBlogs.map((blog, index) => (
              <BlogCard key={blog.slug || blog._id} blog={blog} featured={index === 0} />
            ))}
          </div>
        ) : (
          <Card className="text-center text-slate-500 dark:text-slate-400 py-12">No blog posts available yet.</Card>
        )}
      </section>

      <section className="container pt-4">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 bg-primary px-8 py-12 text-white sm:px-10 sm:py-14 lg:px-12">
              <span className="section-label border-white/20 bg-white/10 text-white">Newsletter</span>
              <div>
                <h2 className="text-3xl font-black tracking-tight sm:text-4xl leading-tight">Get updates on new listings and market trends.</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base sm:leading-8">Stay ahead with featured properties, investment tips, and neighborhood updates delivered to your inbox.</p>
              </div>
            </div>
            <div className="bg-white px-8 py-12 dark:bg-slate-900 sm:px-10 sm:py-14 lg:px-12 flex items-center">
              <form className="w-full space-y-4">
                <input type="email" placeholder="Enter your email" className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-base text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                <Button fullWidth>Subscribe Now</Button>
              </form>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

function SearchWidget() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [purpose, setPurpose] = useState("");
  const [type, setType] = useState("");
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(50000000);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (purpose) params.set("purpose", purpose);
    if (type) params.set("type", type);
    if (minBudget > 0) params.set("minPrice", String(minBudget));
    if (maxBudget > 0) params.set("maxPrice", String(maxBudget));
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-4 shadow-md dark:bg-slate-900">
      <div className="grid gap-3 sm:grid-cols-5">
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (e.g., Dhaka)" className="col-span-2 h-12 rounded-xl border px-3" />
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className="h-12 rounded-xl border px-3">
          <option value="">Purpose</option>
          <option value="sale">Buy</option>
          <option value="rent">Rent</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className="h-12 rounded-xl border px-3">
          <option value="">Property Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
          <option value="studio">Studio</option>
          <option value="office">Office</option>
          <option value="land">Land</option>
        </select>
        <div className="col-span-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span>Minimum budget</span>
              <span className="text-xs text-slate-500">{minBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={50000000}
              step={50000}
              value={minBudget}
              onChange={(e) => setMinBudget(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span>Maximum budget</span>
              <span className="text-xs text-slate-500">{maxBudget.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={500000}
              max={50000000}
              step={50000}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-secondary"
            />
          </label>
        </div>
      </div>
      <div className="mt-3 flex justify-end">
        <button type="submit" className="rounded-xl bg-primary px-5 py-2 text-white">Search</button>
      </div>
    </form>
  );
}
