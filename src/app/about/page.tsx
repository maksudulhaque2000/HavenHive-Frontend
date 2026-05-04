import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarCheck2, ShieldCheck, Sparkles, Users } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const principles = [
  { title: "Curated listings", description: "We focus on a clean marketplace experience with verified properties and clear details." },
  { title: "Trust-first flow", description: "Bookings, saved homes, and messages stay organized with a user-friendly dashboard." },
  { title: "Agent support", description: "Our platform is built to help agents and admins manage inquiries without friction." },
];

const stats = [
  { label: "Listings", value: "1,200+" },
  { label: "Agents", value: "45+" },
  { label: "Bookings", value: "3,000+" },
  { label: "Messages answered", value: "99%" },
];

const values = [
  { icon: ShieldCheck, title: "Trust", description: "Transparent details and consistent workflows." },
  { icon: Sparkles, title: "Quality", description: "Modern, premium UI with a curated feel." },
  { icon: Users, title: "Support", description: "Built for buyers, renters, agents, and admins." },
  { icon: CalendarCheck2, title: "Action", description: "Quick booking, tracking, and follow-up." },
];

export default function AboutPage() {
  return (
    <div className="space-y-28 pb-20">
      <section className="container pt-12 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="section-label mx-auto w-fit">About HavenHive</span>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 text-balance dark:text-slate-100 sm:text-5xl lg:text-6xl leading-tight">
            A real estate platform designed to feel clear, premium, and complete.
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-400">
            HavenHive combines property discovery, booking management, user profiles, admin tools, and content pages into a single marketplace experience.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/properties">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Explore properties
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact the team
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="p-6 sm:p-7 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-4 text-4xl font-black text-slate-900 dark:text-slate-100">{item.value}</p>
          </Card>
        ))}
      </section>

      <section className="container grid gap-8 lg:grid-cols-3">
        {principles.map((item) => (
          <Card key={item.title} className="space-y-5 sm:p-7">
            <BadgeCheck className="h-8 w-8 text-secondary" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">{item.title}</h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{item.description}</p>
          </Card>
        ))}
      </section>

      <section className="container space-y-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-label mx-auto w-fit">Why it matters</span>
          <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl leading-tight">Built for everyone involved in the property journey</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="space-y-5 sm:p-7">
                <Icon className="h-6 w-6 text-secondary" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 sm:text-xl">{item.title}</h3>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}