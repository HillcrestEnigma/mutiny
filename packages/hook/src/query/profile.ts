import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutinyClient } from "../context";
import type { ProfileUpsertPayload } from "@repo/schema";

export function useAuthenticatedProfile() {
  const client = useMutinyClient();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => client.getAuthenticatedProfile(),
    retry: false,
  });
}

export function useUpsertProfile() {
  const query = useQueryClient();
  const client = useMutinyClient();

  return useMutation({
    mutationFn: async (payload: ProfileUpsertPayload) =>
      client.upsertProfile(payload),
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}
