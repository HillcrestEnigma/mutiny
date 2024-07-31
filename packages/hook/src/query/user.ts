import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutinyClient } from "../context";
import type { UserCreatePayload } from "@repo/schema";

export function useAuthenticatedUser() {
  const client = useMutinyClient();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await client.getAuthenticatedUser();
    },
    retry: false,
  });
}

export function useCreateUser() {
  const query = useQueryClient();
  const client = useMutinyClient();

  return useMutation({
    mutationFn: async (payload: UserCreatePayload) => {
      await client.createUser(payload);
    },
    onSuccess: () => {
      query.clear();
    },
  });
}
