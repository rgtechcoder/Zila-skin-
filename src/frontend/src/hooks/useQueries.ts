import { useMutation } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubscribeNewsletter() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.subscribeToNewsletter(email);
    },
  });
}
