import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { SmartbinDrop } from "@/lib/types";
import { useCountry } from "@/context/country-context";

export default function useFirebaseSmartbinDrops() {
  const { selectedCountry } = useCountry();
  const [smartbinsDrops, setSmartbinsDrops] = useState<SmartbinDrop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const smartbinsDropsCollectionRef = useMemo(() => collection(db,`smartbinsDrops-${selectedCountry.code}`), [selectedCountry.code]);

  const fetchSmartbinDrops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(smartbinsDropsCollectionRef);
      const smartbinDropsList: SmartbinDrop[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as SmartbinDrop));
      setSmartbinsDrops(smartbinDropsList);
    } catch (err) {
      console.error("Error fetching smartbinDrops:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching smartbin drops"));
    } finally {
      setLoading(false);
    }
  }, [smartbinsDropsCollectionRef]);

  useEffect(() => {
    fetchSmartbinDrops();
  }, [fetchSmartbinDrops]);

  return { smartbinsDrops, loading, error, fetchSmartbinDrops };
}
