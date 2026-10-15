import { UserProfile } from "@/types/profile";

export function getProfileCompletion(profile: UserProfile | null) {
  const checks: { label: string; done: boolean }[] = [
    { label: "profile photo", done: !!profile?.photoUrl },
    { label: "bio", done: !!profile?.bio?.trim() },
    { label: "skills", done: (profile?.skills?.length ?? 0) > 0 },
    { label: "LinkedIn", done: !!profile?.linkedin?.trim() },
    { label: "interests", done: (profile?.interests?.length ?? 0) > 0 },
  ];

  const doneCount = checks.filter((c) => c.done).length;
  return {
    percent: Math.round((doneCount / checks.length) * 100),
    missing: checks.filter((c) => !c.done).map((c) => c.label),
  };
}
