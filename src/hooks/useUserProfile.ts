import { subscribeToUserProfile } from "@/lib/profile";
import { UserProfile } from "@/types/profile";
import { useEffect, useState } from "react";

export function useUserProfile(uid?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    return subscribeToUserProfile(
      uid,
      (data) => {
        setProfile(data);
        setIsLoading(false);
      },
      () => setIsLoading(false),
    );
  }, [uid]);

  return { profile, isLoading };
}
