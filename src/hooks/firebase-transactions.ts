import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { Transaction, User } from "@/lib/types";
import { useCountry } from "@/context/country-context";
import useFirebaseUsers from "./firebase-users";

export default function useFirebaseTransactions() {
  const { selectedCountry } = useCountry();
  const [rawTransactions, setRawTransactions] = useState<Transaction[]>([]);
  const {users, loading: usersLoading, error: usersError } = useFirebaseUsers();
  const [transactionsLoading, setTransactionsLoading] = useState<boolean>(true);
  const [transactionsError, setTransactionsError] = useState<Error | null>(null);

  const transactionsCollectionRef = useMemo(() => collection(db, `transactions-${selectedCountry.code}`), [selectedCountry.code]);

  const fetchTransactions = useCallback(async () => {
    setTransactionsLoading(true);
    setTransactionsError(null);
    try {
      const querySnapshot = await getDocs(transactionsCollectionRef);
      const transactionsList: Transaction[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() } as Transaction));
      setRawTransactions(transactionsList);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactionsError(err instanceof Error ? err : new Error("An unknown error occurred while fetching transactions"));
    } finally {
      setTransactionsLoading(false);
    }
  }, [transactionsCollectionRef]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const { transactions, loading, error } = useMemo(() => {
    const loading = usersLoading || transactionsLoading;
    const error = usersError || transactionsError;

    if (loading || error) {
      return { transactions: [], loading, error };
    }

    const usersMap = new Map(users.map((user: User) => [user.id, user]));
    const enrichedTransactions = rawTransactions.map(transaction => {
      if (!transaction || !transaction.userId) return transaction;
      let user = usersMap.get(transaction.userId);

      return{
      ...transaction,
      userPhone: user ? user.phone : null,
      userName: user ? user.name : null,
    }});

    return { transactions: enrichedTransactions, loading, error };
  }, [rawTransactions, users, usersLoading, transactionsLoading, usersError]);



  return { transactions, loading, error, fetchTransactions };
}
