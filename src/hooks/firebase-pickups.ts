import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { Pickup } from "@/lib/types";

export default function useFirebasePickups() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const pickupsCollectionRef = useMemo(() => collection(db, "pickups"), []);

  const fetchPickups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(pickupsCollectionRef);
      const pickupsList: Pickup[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Pickup));
      setPickups(pickupsList);
    } catch (err) {
      console.error("Error fetching pickups:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching pickups"));
    } finally {
      setLoading(false);
    }
  }, [pickupsCollectionRef]);

  useEffect(() => {
    fetchPickups();
  }, [fetchPickups]);

  return { pickups, loading, error, fetchPickups };
}
