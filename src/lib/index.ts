import { getDoc, Timestamp as FirebaseTimestamp } from "firebase/firestore";

// Helper function to format Timestamp or string date
export function formatDate(dateValue: FirebaseTimestamp | string | undefined): string {
  if (!dateValue) return "-";
  if (dateValue instanceof FirebaseTimestamp) {
    return dateValue.toDate().toLocaleString(); // Or any other format you prefer
  }
  if (typeof dateValue === "string") {
    // Attempt to parse if it's a string representation that needs parsing
    // For simplicity, assuming it's already a displayable string or ISO string
    try {
      return new Date(dateValue).toLocaleString();
    } catch (e) {
      return dateValue; // Return as is if parsing fails
    }
  }
  return "-";
}
import { Timestamp } from "@/lib/types";

export function timestampToDate(ts: string |Timestamp | undefined): string | undefined {
  if (!ts) return "-";
  if (ts && typeof ts === "object" && "_seconds" in ts && "_nanoseconds" in ts) {
    return new Date(ts._seconds * 1000 + Math.floor(ts._nanoseconds / 1e6)).toLocaleString() || "-";
  }
  if (typeof ts === "string") {
    try {
      return new Date(ts).toLocaleString() || "-";
    } catch (e) {
      return ts || "-"; // Return as is if parsing fails
    }
  }
}

// Define a list of default colors for chart segments
export const defaultColors = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

import { db } from "@/firebase";
import { collection, writeBatch, doc, getDocs, QueryDocumentSnapshot, DocumentData, deleteField } from "firebase/firestore";

const BATCH_SIZE = 500; // safe upper bound per batch

export const createDataCollectionsInBatches = async (dataCollectionsToCreate: any[]) => {
  const dataCollectionsKERef = collection(db, "products-KE");

  // split the input into chunks
  const chunks: any[][] = [];
  for (let i = 0; i < dataCollectionsToCreate.length; i += BATCH_SIZE) {
    chunks.push(dataCollectionsToCreate.slice(i, i + BATCH_SIZE));
  }

  console.log(`Preparing to write ${dataCollectionsToCreate.length} docs in ${chunks.length} batch(es)`);

  for (let idx = 0; idx < chunks.length; idx++) {
    const batchOps = chunks[idx];
    const batch = writeBatch(db);

    batchOps.forEach((tx) => {
      const docRef = doc(dataCollectionsKERef);
      batch.set(docRef, tx);
    });

    try {
      await batch.commit();
      console.log(`✅ Batch ${idx + 1}/${chunks.length} — wrote ${batchOps.length} documents`);
    } catch (err) {
      console.error(`❌ Batch ${idx + 1} failed writing ${batchOps.length} docs`, err);
      // optionally: retry logic or partial recovery
      throw err;
    }
  }

  console.log("🎯 All batches committed successfully.");
};

export const updateFieldFromCollection = async () => {
  const collectionKERef = collection(db, "smartbinsItems-KE");

  const snapshot = await getDocs(collectionKERef);
  const allDocs: QueryDocumentSnapshot<DocumentData>[] = snapshot.docs;

  console.log(`Found ${allDocs.length} documents in collection`);

  // Fetch all users from users-KE and build a phone-to-id map
  const collectionKERef1 = collection(db, "smartbinsDrops-KE");
  const usersSnapshot = await getDocs(collectionKERef1);
  const phoneToUserIdMap = new Map<string, { created: Date; updated: Date }>();
  usersSnapshot.docs.forEach((doc) => {
    const userData = doc.data();
    if (doc.id) {
      phoneToUserIdMap.set(doc.id, userData.clientId);
    }
  });

  // Fix: explicitly type chunks as an array of document arrays
  const chunks: QueryDocumentSnapshot<DocumentData>[][] = [];

  for (let i = 0; i < allDocs.length; i += BATCH_SIZE) {
    chunks.push(allDocs.slice(i, i + BATCH_SIZE));
  }

  for (let idx = 0; idx < chunks.length; idx++) {
    const batch = writeBatch(db);
    const chunk = chunks[idx];

    chunk.forEach(async (docSnap) => {
      const docRef = doc(collectionKERef, docSnap.id);
      const data = docSnap.data();
      const dropId = data.dropId;
      //get clientId from dropId map
      const clientId = phoneToUserIdMap.get(dropId);
      if (!clientId) {
        console.warn(`No clientId found for dropId ${dropId}. Skipping update for document ${docSnap.id}`);
        return;
      }

      batch.update(docRef, {
        clientId: clientId,
      });
    });

    try {
      await batch.commit();
      console.log(`✅ Batch ${idx + 1}/${chunks.length} — updated ${chunk.length} documents`);
    } catch (err) {
      console.error(`❌ Batch ${idx + 1} failed`, err);
      throw err;
    }
  }

  console.log("🎯 Finished editing fields from all documents in collection.");
};

export const removeIdFieldFromCollection = async () => {
  const collectionKERef = collection(db, "users-KE");

  const snapshot = await getDocs(collectionKERef);
  const allDocs: QueryDocumentSnapshot<DocumentData>[] = snapshot.docs;

  console.log(`Found ${allDocs.length} documents in collection`);

  // Fix: explicitly type chunks as an array of document arrays
  const chunks: QueryDocumentSnapshot<DocumentData>[][] = [];

  for (let i = 0; i < allDocs.length; i += BATCH_SIZE) {
    chunks.push(allDocs.slice(i, i + BATCH_SIZE));
  }

  for (let idx = 0; idx < chunks.length; idx++) {
    const batch = writeBatch(db);
    const chunk = chunks[idx];

    chunk.forEach((docSnap) => {
      const docRef = doc(collectionKERef, docSnap.id);
      const data = docSnap.data();

      if ("count" in data) {
        batch.update(docRef, {
          count: deleteField(), // 👈 This tells Firestore to delete the field
          created: new Date(),
          updated: new Date(),
        });
      } else {
        batch.update(docRef, {
          created: new Date(),
          updated: new Date(),
        });
      }
    });

    try {
      await batch.commit();
      console.log(`✅ Batch ${idx + 1}/${chunks.length} — updated ${chunk.length} documents`);
    } catch (err) {
      console.error(`❌ Batch ${idx + 1} failed`, err);
      throw err;
    }
  }

  console.log("🎯 Finished editing fields from all documents in collection.");
};

export const copyCollectionWithEditing = async () => {
  const sourceRef = collection(db, "users");
  const targetRef = collection(db, "users-KE");

  // Fetch all users from users-KE and build a phone-to-id map
  const usersSnapshot = await getDocs(sourceRef);
  const phoneToUserIdMap = new Map<string, { created: Date; updated: Date }>();
  usersSnapshot.docs.forEach((doc) => {
    const userData = doc.data();
    if (doc.id) {
      phoneToUserIdMap.set(doc.id, {
        created: userData.created,
        updated: userData.updated || userData.created,
      });
    }
  });

  const snapshot = await getDocs(targetRef);
  const allDocs: QueryDocumentSnapshot<DocumentData>[] = snapshot.docs;

  console.log(`Found ${allDocs.length} documents to copy`);

  const chunks: QueryDocumentSnapshot<DocumentData>[][] = [];
  for (let i = 0; i < allDocs.length; i += BATCH_SIZE) {
    chunks.push(allDocs.slice(i, i + BATCH_SIZE));
  }

  for (let idx = 0; idx < chunks.length; idx++) {
    const batch = writeBatch(db);
    const chunk = chunks[idx];

    chunk.forEach((docSnap) => {
      const targetData = docSnap.data();

      let timeData = undefined;
      // Check if userId is a phone number in users-KE
      if (targetData.phone && phoneToUserIdMap.has(targetData.phone)) {
        timeData = phoneToUserIdMap.get(targetData.phone);
      }

      // Start with all sourceData fields, then override created/updated
      let newData: any = {
        ...targetData,
        created: timeData?.created || targetData.created,
        updated: timeData?.updated || targetData.updated,
      };

      const targetDocRef = doc(targetRef, docSnap.id); // 🔑 preserve ID
      batch.set(targetDocRef, newData);
    });

    try {
      await batch.commit();
      console.log(`✅ Batch ${idx + 1}/${chunks.length} — copied ${chunk.length} documents`);
    } catch (err) {
      console.error(`❌ Batch ${idx + 1} failed`, err);
      throw err;
    }
  }

  console.log("🎯 Finished copying collection while keeping IDs and updating userId.");
};
