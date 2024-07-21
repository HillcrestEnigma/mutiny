import { useMutation, useQuery } from "@tanstack/react-query";
import { useMutinyClient } from "../context";
import type { SessionCreatePayload } from "@repo/schema";

export function useAuthenticatedSession() {
  const client = useMutinyClient();

  return useQuery({
    queryKey: ["session"],
    queryFn: async () => client.getAuthenticatedSession(),
  });
}

export function useCreateSession() {
  const client = useMutinyClient();

  return useMutation({
    mutationFn: async (payload: SessionCreatePayload) =>
      client.createSession(payload),
  });
}

export function useDeleteAuthenticatedSession() {
  const client = useMutinyClient();

  return useMutation({
    mutationFn: async () => client.deleteAuthenticatedSession(),
  });
}
