import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutinyClient } from "../context";
import type { ProfileUpsertPayload } from "@repo/schema";

export function useAuthenticatedProfile() {
  const client = useMutinyClient();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return await client.getAuthenticatedProfile();
    },
    retry: false,
  });
}

export function useUpsertProfile() {
  const query = useQueryClient();
  const client = useMutinyClient();

  return useMutation({
    mutationFn: async (payload: ProfileUpsertPayload) => {
      await client.upsertProfile(payload);
    },
    onSuccess: () => {
      return query.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}
