import { DUMMY_IDEAS } from "@/data/dummyIdeas";
import { Idea } from "@/types/idea";
import { createContext, ReactNode, useContext, useState } from "react";

type IdeasContextType = {
  ideas: Idea[];
  addIdea: (idea: Idea) => void;
};

const IdeasContext = createContext<IdeasContextType | undefined>(undefined);

export function IdeasProvider({ children }: { children: ReactNode }) {
  const [ideas, setIdeas] = useState<Idea[]>(DUMMY_IDEAS);

  const addIdea = (idea: Idea) => {
    setIdeas((prev) => [idea, ...prev]);
  };

  return (
    <IdeasContext.Provider value={{ ideas, addIdea }}>
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
