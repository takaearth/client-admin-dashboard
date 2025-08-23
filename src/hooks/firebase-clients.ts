import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, addDoc, updateDoc, doc, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { Client } from "@/lib/types";
import { useCountry } from "@/context/country-context";

export default function useFirebaseClients() {
  const { selectedCountry } = useCountry();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const clientsCollectionRef = useMemo(() => collection(db, `clients-${selectedCountry.code}`), [selectedCountry.code]);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(clientsCollectionRef);
      const clientsList: Client[] = querySnapshot.docs.map((docSnap: QueryDocumentSnapshot<DocumentData>) => ({ id: docSnap.id, ...docSnap.data() } as Client));
      setClients(clientsList);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching clients"));
    } finally {
      setLoading(false);
    }
  }, [clientsCollectionRef]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  async function addClient(newClientData: Omit<Client, "id">) {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(clientsCollectionRef, newClientData);
      const newClient = { id: docRef.id, ...newClientData } as Client;
      setClients((prevClients) => [...prevClients, newClient]);
      setLoading(false);
      return newClient;
    } catch (err) {
      console.error("Error adding client:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while adding client"));
      setLoading(false);
      throw err; // Re-throw to allow caller to handle
    }
  }

  async function editClient(clientId: string, updatedClientData: Partial<Omit<Client, "id">>) {
    setLoading(true);
    setError(null);
    try {
      const clientDocRef = doc(clientsCollectionRef, clientId);
      await updateDoc(clientDocRef, updatedClientData);
      setClients((prevClients) => prevClients.map((client) => (client.id === clientId ? { ...client, ...updatedClientData } : client)));
      setLoading(false);
      return { id: clientId, ...updatedClientData } as Client;
    } catch (err) {
      console.error("Error editing client:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while editing client"));
      setLoading(false);
      throw err; // Re-throw to allow caller to handle
    }
  }

  return { clients, loading, error, addClient, editClient, fetchClients };
}
