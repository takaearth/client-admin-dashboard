import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { User } from "@/lib/types";
import { useCountry } from "@/context/country-context";

export default function useFirebaseUsers() {
  const { selectedCountry } = useCountry();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const usersCollectionRef = useMemo(() => collection(db, `users-${selectedCountry.code}`), [selectedCountry.code]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(usersCollectionRef);
      const usersList: User[] = [];

      querySnapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = { id: doc.id, ...doc.data() };
        usersList.push(data as User);
      });
      setUsers(usersList);
    } catch (err) {
      console.error("Error fetching users/events:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching users and events"));
    } finally {
      setLoading(false);
    }
  }, [usersCollectionRef]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, fetchUsers };
}
