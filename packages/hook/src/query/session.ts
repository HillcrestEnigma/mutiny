import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutinyClient } from "../context";
import type { SessionCreatePayload } from "@repo/schema";

export function useAuthenticatedSession() {
  const client = useMutinyClient();

  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      return await client.getAuthenticatedSession();
    },
    retry: false,
  });
}

export function useCreateSession() {
  const query = useQueryClient();
  const client = useMutinyClient();

  return useMutation({
    mutationFn: async (payload: SessionCreatePayload) => {
      await client.createSession(payload);
    },
    onSuccess: () => {
      query.clear();
    },
  });
}

export function useDeleteAuthenticatedSession() {
  const query = useQueryClient();
  const client = useMutinyClient();

  return useMutation({
    mutationFn: async () => {
      await client.deleteAuthenticatedSession();
    },
    onSuccess: () => {
      query.clear();
    },
  });
}
