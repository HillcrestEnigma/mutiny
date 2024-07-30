import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutinyClient } from "../context";
import type { UserCreatePayload } from "@repo/schema";

export function useAuthenticatedUser() {
  const client = useMutinyClient();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => client.getAuthenticatedUser(),
    retry: false,
  });
}

export function useCreateUser() {
  const query = useQueryClient();
  const client = useMutinyClient();

  return useMutation({
    mutationFn: async (payload: UserCreatePayload) =>
      client.createUser(payload),
    onSuccess: () => {
      query.invalidateQueries({
        queryKey: ["user"],
      });
      query.invalidateQueries({
        queryKey: ["session"],
      });
      query.invalidateQueries({
        queryKey: ["profile"],
      });
    },
  });
}
