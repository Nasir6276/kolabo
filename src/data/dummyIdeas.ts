import { Idea } from "@/types/idea";

import { Category } from "@/types/idea";

export const DUMMY_IDEAS: Idea[] = [
  {
    id: "1",
    title: "Campus food delivery, but for hostels",
    description:
      "A lightweight delivery app connecting hostel students to nearby food vendors, cutting delivery time by cutting distance.",
    categories: ["Business", "Technology"],
    rolesOpen: 2,
    rolesTotal: 4,
    postedBy: {
      name: "Amara O.",
      avatarUrl: "https://i.pravatar.cc/100?img=1",
    },
    isFeatured: true,
  },
  {
    id: "2",
    title: "AI-assisted budgeting for freelancers",
    description:
      "Helping freelancers forecast income and set aside taxes automatically based on invoice history.",
    categories: ["Finance", "Technology"],
    rolesOpen: 1,
    rolesTotal: 3,
    postedBy: { name: "Tobi A.", avatarUrl: "https://i.pravatar.cc/100?img=2" },
    isFeatured: true,
  },
  {
    id: "3",
    title: "Local artisan marketplace",
    description:
      "A curated marketplace for handmade goods from local artisans, with story-driven product pages.",
    categories: ["Design", "Business"],
    rolesOpen: 3,
    rolesTotal: 5,
    postedBy: {
      name: "Chiamaka N.",
      avatarUrl: "https://i.pravatar.cc/100?img=3",
    },
    isFeatured: true,
  },
  {
    id: "4",
    title: "Mental health check-in app for students",
    description:
      "Daily mood check-ins with anonymized trend data shared with campus counselors, with consent.",
    categories: ["Health", "Social Impact"],
    rolesOpen: 2,
    rolesTotal: 4,
    postedBy: {
      name: "David E.",
      avatarUrl: "https://i.pravatar.cc/100?img=4",
    },
  },
  {
    id: "5",
    title: "Peer-to-peer skill swap platform",
    description:
      "Trade skills instead of money — teach a language, learn to code, no cash involved.",
    categories: ["Education", "Social Impact"],
    rolesOpen: 4,
    rolesTotal: 4,
    postedBy: {
      name: "Zainab M.",
      avatarUrl: "https://i.pravatar.cc/100?img=5",
    },
  },
  {
    id: "6",
    title: "Micro-influencer matchmaking tool",
    description:
      "Connecting small brands with micro-influencers based on niche and engagement, not follower count.",
    categories: ["Marketing", "Business"],
    rolesOpen: 1,
    rolesTotal: 3,
    postedBy: { name: "Femi K.", avatarUrl: "https://i.pravatar.cc/100?img=6" },
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
