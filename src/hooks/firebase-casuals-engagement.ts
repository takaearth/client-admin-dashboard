import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { CasualEngagement } from "@/lib/types";

export default function useFirebaseCasualEngagement() {
  const [casualsEngagements, setCasualEngagement] = useState<CasualEngagement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const casualsEngagementsCollectionRef = useMemo(() => collection(db, "casualsEngagements"), []);

  const fetchCasualsEngagement = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(casualsEngagementsCollectionRef);
      const casualsEngagementsList: CasualEngagement[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as CasualEngagement));
      setCasualEngagement(casualsEngagementsList);
    } catch (err) {
      console.error("Error fetching casualsEngagements:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching casualsEngagements"));
    } finally {
      setLoading(false);
    }
  }, [casualsEngagementsCollectionRef]);

  useEffect(() => {
    fetchCasualsEngagement();
  }, [fetchCasualsEngagement]);

  async function addCasualEngagement(newCasualEngagementData: Omit<CasualEngagement, "id">) {
    setLoading(true);
    setError(null);
    try {
      //created timestamp
      newCasualEngagementData.created = new Date();
      //updated timestamp
      newCasualEngagementData.updated = new Date();
      const docRef = await addDoc(casualsEngagementsCollectionRef, newCasualEngagementData);
      const newCasualEngagement = { id: docRef.id, ...newCasualEngagementData } as CasualEngagement;
      setCasualEngagement((prevCasualEngagement) => [...prevCasualEngagement, newCasualEngagement]);
      setLoading(false);
      return newCasualEngagement;
    } catch (err) {
      console.error("Error adding casualEngagement:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while adding casualEngagement"));
      setLoading(false);
      throw err; // Re-throw to allow caller to handle
    }
  }

  async function editCasualEngagement(casualEngagementId: string, updatedCasualEngagementData: Partial<Omit<CasualEngagement, "id">>) {
    setLoading(true);
    setError(null);
    try {
      const casualEngagementDocRef = doc(casualsEngagementsCollectionRef, casualEngagementId);
      //updated timestamp
      updatedCasualEngagementData.updated = new Date();
      await updateDoc(casualEngagementDocRef, updatedCasualEngagementData);
      setCasualEngagement((prevCasualEngagement) =>
        prevCasualEngagement.map((casualEngagement) => (casualEngagement.id === casualEngagementId ? { ...casualEngagement, ...updatedCasualEngagementData } : casualEngagement))
      );
      setLoading(false);
      return { id: casualEngagementId, ...updatedCasualEngagementData } as CasualEngagement;
    } catch (err) {
      console.error("Error editing casualEngagement:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while editing casualEngagement"));
      setLoading(false);
      throw err; // Re-throw to allow caller to handle
    }
  }

  return { casualsEngagements, loading, error, addCasualEngagement, editCasualEngagement, fetchCasualsEngagement };
}
