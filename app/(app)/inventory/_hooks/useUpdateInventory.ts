import { INewInventoryForm } from "@/types/inventory.type";
import { useMutation } from "@tanstack/react-query";
import { updateInventory } from "../actions";

interface IUseUpdateInventoryProps {
  onSuccess?: () => void;
  onError?: () => void;
}
export const useUpdateInventory = ({ onSuccess, onError }: IUseUpdateInventoryProps = {}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: INewInventoryForm }) => {
      const result = await updateInventory(id, data);
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
    updateInventory: mutateAsync,
    isUpdating: isPending,
  };
};
