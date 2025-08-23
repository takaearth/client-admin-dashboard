import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useGetUsers() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("https://us-central1-taka-earth.cloudfunctions.net/adminAPI/getUsers/KE", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.idToken}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          // Token is invalid, trigger a refresh at app level
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to fetch user smartbin drops");
      }

      const json = await res.json();
      return json.data;
    },
    enabled: !!session?.user?.idToken,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export const usePdfDownloadMutation = () => {
  const { data: session } = useSession();
  console.log("Session data:", session);
  return useMutation({
    mutationFn: async (payload: { title: string; labels: string[]; values: number[] }) => {
      const res = await fetch("https://us-central1-taka-earth.cloudfunctions.net/adminAPI/producePDF/KE", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.idToken}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          // Token is invalid, trigger a refresh at app level
          throw new Error("Unauthorized");
        }
        throw new Error("Failed to generate PDF");
      }

      const json = await res.json();
      return json.data;
    },
  });
};

// pdfMutation.mutate(
//   {
//     title: "Sales Report",
//     labels: ["Jan", "Feb", "Mar", "Apr"],
//     values: [120, 200, 150, 300],
//   },
//   {
//     onSuccess: (data) => {
//       console.log("PDF URL:", data);
//     },
//     onError: (err) => {
//       console.error("Error generating PDF:", err);
//     },
//   }
// );