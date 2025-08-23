import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { Request } from "@/lib/types";

export default function useFirebaseRequests() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const requestsCollectionRef = useMemo(() => collection(db, "requests"), []);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(requestsCollectionRef);
      const requestsList: Request[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Request));
      setRequests(requestsList);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching requests"));
    } finally {
      setLoading(false);
    }
  }, [requestsCollectionRef]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { requests, loading, error, fetchRequests };
}
