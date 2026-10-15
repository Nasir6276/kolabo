import { Idea } from "@/types/idea";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type NewIdea = Omit<Idea, "id">;

// Firestore rejects `undefined` values, so strip them before writing
function stripUndefined<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T;
}

export async function createIdea(idea: NewIdea): Promise<string> {
  const ref = await addDoc(collection(db, "ideas"), {
    ...stripUndefined(idea),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export function subscribeToIdeas(
  onData: (ideas: Idea[]) => void,
  onError?: (error: Error) => void,
) {
  const q = query(collection(db, "ideas"), orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const ideas = snapshot.docs.map(
        (d) => ({ ...(d.data() as Omit<Idea, "id">), id: d.id }) as Idea,
      );
      onData(ideas);
    },
    onError,
  );
}
