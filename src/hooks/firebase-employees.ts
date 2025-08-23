import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { Employee } from "@/lib/types";

export default function useFirebaseEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const employeesCollectionRef = useMemo(() => collection(db, "takaEmployees"), []);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(employeesCollectionRef);
      const employeesList: Employee[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Employee));
      setEmployees(employeesList);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching employees"));
    } finally {
      setLoading(false);
    }
  }, [employeesCollectionRef]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { employees, loading, error, fetchEmployees };
}
