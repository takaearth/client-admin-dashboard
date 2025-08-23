import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { Casual } from "@/lib/types";

export default function useFirebaseCasuals() {
  const [casuals, setCasuals] = useState<Casual[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const casualsCollectionRef = useMemo(() => collection(db, "casuals"), []);

  const fetchCasuals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(casualsCollectionRef);
      const casualsList: Casual[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Casual));
      setCasuals(casualsList);
    } catch (err) {
      console.error("Error fetching casuals:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching casuals"));
    } finally {
      setLoading(false);
    }
  }, [casualsCollectionRef]);

  useEffect(() => {
    fetchCasuals();
  }, [fetchCasuals]);

  async function addCasual(newCasualData: Omit<Casual, "id">) {
    setLoading(true);
    setError(null);
    try {
      //created timestamp
      newCasualData.created = new Date();
      //updated timestamp
      newCasualData.updated = new Date();
      const docRef = await addDoc(casualsCollectionRef, newCasualData);
      const newCasual = { id: docRef.id, ...newCasualData } as Casual;
      setCasuals((prevCasual) => [...prevCasual, newCasual]);
      setLoading(false);
      return newCasual;
    } catch (err) {
      console.error("Error adding casual:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while adding casual"));
      setLoading(false);
      throw err; // Re-throw to allow caller to handle
    }
  }

  async function editCasual(casualId: string, updatedCasualData: Partial<Omit<Casual, "id">>) {
    setLoading(true);
    setError(null);
    try {
      const casualDocRef = doc(casualsCollectionRef, casualId);
      //updated timestamp
      updatedCasualData.updated = new Date();
      await updateDoc(casualDocRef, updatedCasualData);
      setCasuals((prevCasuals) => prevCasuals.map((casual) => (casual.id === casualId ? { ...casual, ...updatedCasualData } : casual)));
      setLoading(false);
      return { id: casualId, ...updatedCasualData } as Casual;
    } catch (err) {
      console.error("Error editing casual:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while editing casual"));
      setLoading(false);
      throw err; // Re-throw to allow caller to handle
    }
  }

  return { casuals, loading, error, addCasual, editCasual, fetchCasuals };
}
