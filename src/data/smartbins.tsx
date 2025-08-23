import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useGetSmartbins() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["smartbins"],
    queryFn: async () => {
      const res = await fetch("https://us-central1-taka-earth.cloudfunctions.net/adminAPI/getSmartbins/KE", {
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

export function useGetSmartbinsDrops() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["smartbins-drops"],
    queryFn: async () => {
      const res = await fetch("https://us-central1-taka-earth.cloudfunctions.net/adminAPI/getSmartbinsDrops/KE", {
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
