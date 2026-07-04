import { toast } from "@heroui/react";

interface Props {
  title: string;
  message: string;
}

function useToast() {
  const _toast = {
    success: ({ title, message }: Props) => {
      toast.success(title, { description: message });
    },
    error: ({ title, message }: Props) => {
      toast.danger(title, { description: message });
    },
  };
  return { toast: _toast };
}

export default useToast;
