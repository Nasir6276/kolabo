import { useAuth } from "@/components/AuthContext";
import { createIdea, NewIdea, subscribeToIdeas } from "@/lib/ideas";
import { Idea } from "@/types/idea";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type IdeasContextType = {
  ideas: Idea[];
  isLoading: boolean;
  addIdea: (idea: NewIdea) => Promise<string>;
};

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export function IdeasProvider({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // rules require auth, so only listen while signed in
    if (!isSignedIn) {
      setIdeas([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const unsubscribe = subscribeToIdeas(
      (data) => {
        setIdeas(data);
        setIsLoading(false);
      },
      (error) => {
        console.warn("Failed to load ideas:", error.message);
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, [isSignedIn]);

  const addIdea = (idea: NewIdea) => createIdea(idea);

  return (
    <IdeasContext.Provider value={{ ideas, isLoading, addIdea }}>
      {children}
    </IdeasContext.Provider>
  );
}

export function useIdeas() {
  const context = useContext(IdeasContext);
  if (!context) {
    throw new Error("useIdeas must be used within an IdeasProvider");
  }
  return context;
}
