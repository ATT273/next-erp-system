import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useUserContext } from "../_context/user-provider";
import useToast from "../../_hooks/use-toast";
import { IResetPasswordForm } from "@/types/user.type";
import { resetUserPassword, updateUser } from "../actions";
import ResetPasswordForm from "./reset-password-form";

interface EditUserDialogProps {
  opened: boolean;
  setOpened: (open: boolean) => void;
}
const ResetPasswordDialog = ({ opened, setOpened }: EditUserDialogProps) => {
  const { editingUser } = useUserContext();
  const { toast } = useToast();

  const handleSubmit = async (data: IResetPasswordForm) => {
    const result = await resetUserPassword({ id: editingUser?.id!, password: data.password });

    if (result.status === 200) {
      toast.success({
        title: "Success",
        message: "Password has been updated",
      });
      setOpened(false);
    } else {
      toast.error({
        title: "Fail",
        message: `Failed to update password: ${result.message}`,
      });
    }
  };

  return (
    <Modal isOpen={opened} onOpenChange={setOpened} size="xl" className="pt-2 relative" isDismissable={false}>
      <ModalContent>
        <ResetPasswordForm setOpen={setOpened} handleSubmit={handleSubmit} />
      </ModalContent>
    </Modal>
  );
};

export default ResetPasswordDialog;
