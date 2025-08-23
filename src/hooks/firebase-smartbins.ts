import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { Smartbin } from "@/lib/types";
import { useCountry } from "@/context/country-context";

export default function useFirebaseSmartbins() {
  const { selectedCountry } = useCountry();
  const [smartbins, setSmartbins] = useState<Smartbin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const smartbinsCollectionRef = useMemo(() => collection(db, `smartbins-${selectedCountry.code}`), [selectedCountry.code]);

  const fetchSmartbins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(smartbinsCollectionRef);
      const smartbinsList: Smartbin[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Smartbin));
      setSmartbins(smartbinsList);
    } catch (err) {
      console.error("Error fetching smartbins:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching smartbins"));
    } finally {
      setLoading(false);
    }
  }, [smartbinsCollectionRef]);

  useEffect(() => {
    fetchSmartbins();
  }, [fetchSmartbins]);

  async function addSmartbin(newSmartbinData: Omit<Smartbin, "id">) {
    setLoading(true);
    setError(null);
    try {
      //created timestamp
      newSmartbinData.created = new Date();
      //updated timestamp
      newSmartbinData.updated = new Date();
      //add country
      newSmartbinData.address.country = selectedCountry.name;
      const docRef = await addDoc(smartbinsCollectionRef, newSmartbinData);
      const newSmartbin = { id: docRef.id, ...newSmartbinData } as Smartbin;
      setSmartbins((prevSmartbins) => [...prevSmartbins, newSmartbin]);
      setLoading(false);
      return newSmartbin;
    } catch (err) {
      console.error("Error adding smartbin:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while adding smartbin"));
      setLoading(false);
      throw err; // Re-throw to allow caller to handle
    }
  }

  async function editSmartbin(smartbinId: string, updatedSmartbinData: Partial<Omit<Smartbin, "id">>) {
    setLoading(true);
    setError(null);
    try {
      const smartbinDocRef = doc(smartbinsCollectionRef, smartbinId);
      //updated timestamp
      updatedSmartbinData.updated = new Date();
      updatedSmartbinData.address.country = selectedCountry.name;
      await updateDoc(smartbinDocRef, updatedSmartbinData);
      setSmartbins((prevSmartbins) => prevSmartbins.map((smartbin) => (smartbin.id === smartbinId ? { ...smartbin, ...updatedSmartbinData } : smartbin)));
      setLoading(false);
      return { id: smartbinId, ...updatedSmartbinData } as Smartbin;
    } catch (err) {
      console.error("Error editing smartbin:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while editing smartbin"));
      setLoading(false);
      throw err; // Re-throw to allow caller to handle
    }
  }

  return { smartbins, loading, error, addSmartbin, editSmartbin, fetchSmartbins };
}
