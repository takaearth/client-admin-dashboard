import { useState, useEffect, useCallback, useMemo } from "react";
import { collection, getDocs, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
//custom
import { db } from "@/firebase";
import { Event } from "@/lib/types";
import { useCountry } from "@/context/country-context";

export default function useFirebaseEvents() {
  const { selectedCountry } = useCountry();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const eventsCollectionRef = useMemo(() => collection(db, `events-${selectedCountry.code}`), [selectedCountry.code]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(eventsCollectionRef);
      const eventsList: Event[] = [];

      querySnapshot.docs.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = { id: doc.id, ...doc.data() };
        eventsList.push(data as Event);
      });
      setEvents(eventsList);
    } catch (err) {
      console.error("Error fetching users/events:", err);
      setError(err instanceof Error ? err : new Error("An unknown error occurred while fetching users and events"));
    } finally {
      setLoading(false);
    }
  }, [eventsCollectionRef]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, fetchEvents };
}
