import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutinyClient } from "../context";
import type { SessionCreatePayload } from "@repo/schema";

export function useAuthenticatedSession() {
  const client = useMutinyClient();

  return useQuery({
    queryKey: ["session"],
    queryFn: async () => client.getAuthenticatedSession(),
    retry: false,
  });
}

export function useCreateSession() {
  const query = useQueryClient();
  const client = useMutinyClient();

  return useMutation({
    mutationFn: async (payload: SessionCreatePayload) =>
      client.createSession(payload),
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["user"],
      });
      query.invalidateQueries({
        queryKey: ["session"],
      });
    },
  });
}

export function useDeleteAuthenticatedSession() {
  const query = useQueryClient();
  const client = useMutinyClient();

  return useMutation({
    mutationFn: async () => client.deleteAuthenticatedSession(),
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["user"],
      });
      query.invalidateQueries({
        queryKey: ["session"],
      });
    },
  });
}
