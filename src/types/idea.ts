export type Category =
  | "Technology"
  | "Design"
  | "Business"
  | "Marketing"
  | "Finance"
  | "Health"
  | "Education"
  | "Social Impact";

export type Role = {
  id: string;
  title: string;
  isFilled: boolean;
};

export type Idea = {
  id: string;
  title: string;
  description: string;
  categories: Category[];
  roles: Role[];
  postedBy: {
    name: string;
    avatarUrl: string;
  };
  isFeatured?: boolean;
  imageUrl?: string;
  requirements: string[];
  timeframe: string;
  location: string;
};
