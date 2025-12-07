import { INewInventoryForm } from "@/types/inventory.type";
import { useMutation } from "@tanstack/react-query";
import { createInventory } from "../actions";

interface IUseUpdateInventoryProps {
  onSuccess?: () => void;
  onError?: () => void;
}
export const useAddInventory = ({ onSuccess, onError }: IUseUpdateInventoryProps = {}) => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ data }: { data: INewInventoryForm }) => {
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
