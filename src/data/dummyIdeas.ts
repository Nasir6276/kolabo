import { Category, Idea } from "@/types/idea";

export const DUMMY_IDEAS: Idea[] = [
  {
    id: "1",
    title: "Campus food delivery, but for hostels",
    description:
      "Most delivery apps treat every address the same way, even though hostels have their own logistics — shared gates, security checks, and clustered addresses that make standard delivery routing inefficient. This idea reimagines delivery specifically for hostel life: a lightweight app connecting students to nearby food vendors, with routes optimized for hostel clusters instead of generic city-wide delivery zones. Riders could serve five hostels on one street in the time it takes a regular delivery app to serve one house on the other side of town. The long-term vision includes vendor onboarding tools, live order tracking, and a rating system built around trust within a specific campus community rather than anonymous city-wide reviews.",
    categories: ["Business", "Technology"],
    rolesOpen: 2,
    rolesTotal: 4,
    postedBy: {
      name: "Amara O.",
      avatarUrl: "https://i.pravatar.cc/100?img=1",
    },
    isFeatured: true,
    imageUrl:
      "https://loremflickr.com/400/300/artificial-intelligence,technology",
    requirements: [
      "Mobile app for ordering (iOS and Android)",
      "Vendor dashboard for managing orders and menus",
      "Basic route optimization for hostel clusters",
      "Payment integration for local payment methods",
    ],
    skillsNeeded: [
      "React Native",
      "Backend/API development",
      "UI/UX design",
      "Logistics planning",
    ],
    timeframe: "3–4 months to MVP",
    location: "Lagos, Nigeria · Remote-friendly",
  },
  {
    id: "2",
    title: "AI-assisted budgeting for freelancers",
    description:
      "Freelance income is unpredictable, and most budgeting apps are built around a steady monthly paycheck, which makes them useless for freelancers trying to plan ahead. This idea is an AI-assisted budgeting tool that looks at a freelancer's invoice and payment history to forecast likely income over the next few months, then automatically suggests how much to set aside for taxes, savings, and slow periods. Instead of static spreadsheets, the app would learn from patterns in a freelancer's actual work — client payment delays, seasonal dips, recurring clients — and adjust its recommendations accordingly. The goal is to give freelancers the same peace of mind a salaried employee has, without requiring them to become spreadsheet experts.",
    categories: ["Finance", "Technology"],
    rolesOpen: 1,
    rolesTotal: 3,
    postedBy: { name: "Tobi A.", avatarUrl: "https://i.pravatar.cc/100?img=2" },
    isFeatured: true,
    imageUrl: "https://loremflickr.com/400/300/coding,startup",
    requirements: [
      "Income forecasting model based on historical invoice data",
      "Simple dashboard showing projected income and savings targets",
      "Bank/invoice integration (Plaid or similar)",
      "Tax set-aside recommendations by region",
    ],
    skillsNeeded: [
      "Data science / ML",
      "Fintech API integration",
      "Product design",
      "Backend development",
    ],
    timeframe: "4–6 months to MVP",
    location: "Remote",
  },
  {
    id: "3",
    title: "Local artisan marketplace",
    description:
      "Most marketplace apps flatten every seller into the same generic grid of products and prices, which works against artisans whose value often comes from the story behind what they make. This idea is a curated marketplace built specifically for local, handmade goods, where every product page gives space to the maker's story, process, and materials — not just a photo and a price tag. The bet is that buyers who care about where things come from will pay more, return more often, and share more, if the platform actually lets that story come through instead of burying it. Early focus would be a single city or region to build density and trust before expanding.",
    categories: ["Design", "Business"],
    rolesOpen: 3,
    rolesTotal: 5,
    postedBy: {
      name: "Chiamaka N.",
      avatarUrl: "https://i.pravatar.cc/100?img=3",
    },
    isFeatured: true,
    imageUrl: "https://loremflickr.com/400/300/technology,innovation",
    requirements: [
      "Storefront pages with rich media support for maker stories",
      "Order and inventory management for sellers",
      "Search and discovery by category, region, and material",
      "Secure checkout and payout system for artisans",
    ],
    skillsNeeded: [
      "Frontend development",
      "E-commerce/payments",
      "Content strategy",
      "Community management",
    ],
    timeframe: "5–6 months to MVP",
    location: "Abuja, Nigeria",
  },
  {
    id: "4",
    title: "Mental health check-in app for students",
    description:
      "Campus counseling services are usually reactive — students reach out only once things have already gotten difficult, and counselors have no visibility into how students are doing day-to-day. This idea is a simple daily mood check-in app for students, where anonymized, aggregated trend data can be shared with campus counselors (only with student consent) to help them spot patterns early, like a dorm or department showing signs of rising stress during exam season. For students, it's a quick, low-friction way to reflect on their day; for counselors, it's an early-warning signal instead of guesswork.",
    categories: ["Health", "Social Impact"],
    rolesOpen: 2,
    rolesTotal: 4,
    postedBy: {
      name: "David E.",
      avatarUrl: "https://i.pravatar.cc/100?img=4",
    },
    requirements: [
      "Daily mood check-in flow (quick, under 30 seconds)",
      "Anonymized trend dashboard for counselors",
      "Consent and privacy controls for students",
      "Optional resources/prompts based on mood patterns",
    ],
    skillsNeeded: [
      "Mobile development",
      "Data privacy/security",
      "UX research",
      "Psychology background (advisory)",
    ],
    timeframe: "3–5 months to MVP",
    location: "Port Harcourt, Nigeria · On-campus",
  },
  {
    id: "5",
    title: "Peer-to-peer skill swap platform",
    description:
      "Not everyone has money to spend on lessons, but almost everyone has a skill someone else wants to learn. This idea is a peer-to-peer platform where people trade skills directly instead of paying for them — teach a language in exchange for learning to code, or help someone with design work in exchange for a cooking lesson. The platform's job is to make matching, scheduling, and trust easy enough that a barter economy for skills actually works at scale, with profiles, availability calendars, and a review system built around fairness of the trade rather than star ratings alone.",
    categories: ["Education", "Social Impact"],
    rolesOpen: 4,
    rolesTotal: 4,
    postedBy: {
      name: "Zainab M.",
      avatarUrl: "https://i.pravatar.cc/100?img=5",
    },
    requirements: [
      "Skill-matching algorithm based on offered/wanted skills",
      "Scheduling and availability system",
      "In-app messaging between matched users",
      "Trade-based review and trust system",
    ],
    skillsNeeded: [
      "Full-stack development",
      "Matching algorithms",
      "UI/UX design",
      "Community moderation",
    ],
    timeframe: "4 months to MVP",
    location: "Remote",
  },
  {
    id: "6",
    title: "Micro-influencer matchmaking tool",
    description:
      "Small brands are usually priced out of influencer marketing because the platforms and agencies built for it are designed around big-budget campaigns with celebrity-tier influencers. This idea flips that by focusing entirely on micro-influencers — accounts with smaller but highly engaged, niche audiences — and matching them to small brands based on actual audience fit and engagement quality rather than raw follower count. For a small skincare brand, ten micro-influencers with genuinely engaged niche audiences will often outperform one big name with a broad but indifferent following, and this tool is built to prove that with real matching data.",
    categories: ["Marketing", "Business"],
    rolesOpen: 1,
    rolesTotal: 3,
    postedBy: { name: "Femi K.", avatarUrl: "https://i.pravatar.cc/100?img=6" },
    requirements: [
      "Influencer discovery and filtering by niche/engagement",
      "Brand-side campaign brief and matching tool",
      "Basic analytics on engagement quality (not just follower count)",
      "In-app negotiation/messaging flow",
    ],
    skillsNeeded: [
      "Backend development",
      "Data analytics",
      "Growth marketing",
      "Partnerships",
    ],
    timeframe: "3 months to MVP",
    location: "Lagos, Nigeria · Remote-friendly",
  },
];

export const CATEGORIES: (Category | "All")[] = [
  "All",
  "Technology",
  "Design",
  "Business",
  "Marketing",
  "Finance",
  "Health",
  "Education",
  "Social Impact",
];
