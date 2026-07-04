import { ICreateInventoryRequest } from "@/types/requests/inventory.request";
import { useMutation } from "@tanstack/react-query";
import { createInventory } from "../actions";

interface IUseAddInventoryProps {
  onSuccess?: () => void;
  onError?: () => void;
}
export const useAddInventory = ({ onSuccess, onError }: IUseAddInventoryProps = {}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ data }: { data: ICreateInventoryRequest }) => {
      const result = await createInventory(data);
      return result;
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: () => {
      onError?.();
    },
  });

  return {
    addInventory: mutateAsync,
    isAdding: isPending,
  };
};
