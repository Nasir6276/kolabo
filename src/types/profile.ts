export type Intent = "join" | "post" | "both";

export type UserProfile = {
  bio?: string;
  skills?: string[];
  linkedin?: string;
  intent?: Intent;
  interests?: string[];
  photoUrl?: string;
};

export type PrivateInfo = {
  dob?: string;
};
