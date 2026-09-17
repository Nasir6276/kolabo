export type Category =
  | "Technology"
  | "Design"
  | "Business"
  | "Marketing"
  | "Finance"
  | "Health"
  | "Education"
  | "Social Impact";

export type Idea = {
  id: string;
  title: string;
  description: string;
  categories: Category[];
  rolesOpen: number;
  rolesTotal: number;
  postedBy: {
    name: string;
    avatarUrl: string;
  };
  isFeatured?: boolean;
};
