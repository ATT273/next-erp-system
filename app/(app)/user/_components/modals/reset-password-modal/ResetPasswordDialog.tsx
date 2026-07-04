"use client";

import { Modal, useOverlayState } from "@heroui/react";
import { useUserContext } from "@/app/(app)/user/_context/user-provider";
import useToast from "@/app/(app)/_hooks/use-toast";
import { IResetPasswordForm } from "@/types/user.type";
import { resetUserPassword } from "@/app/(app)/user/actions";
import ResetPasswordForm from "@/app/(app)/user/_components/forms/ResetPasswordForm";
import UserModalFooter from "@/app/(app)/user/_components/modals/user-modal/UserDialogFooter";

interface ResetPasswordDialogProps {
  opened: boolean;
  setOpened: (open: boolean) => void;
}

const ResetPasswordDialog = ({ opened, setOpened }: ResetPasswordDialogProps) => {
  const { editingUser } = useUserContext();
  const { toast } = useToast();
  const state = useOverlayState({ isOpen: opened, onOpenChange: setOpened });

  const handleClose = () => setOpened(false);

  const handleSubmit = async (data: IResetPasswordForm) => {
    const result = await resetUserPassword({ id: editingUser?.id!, password: data.password });
    if (result.status === 200) {
      toast.success({ title: "Success", message: "Password has been updated" });
      handleClose();
    } else {
      toast.error({ title: "Fail", message: `Failed to update password: ${result.message}` });
    }
  };

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog className="max-w-2xl max-h-full">
            <Modal.CloseTrigger onPress={handleClose} />
            <Modal.Header>
              <Modal.Heading>Reset password</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <ResetPasswordForm handleSubmit={handleSubmit} />
            </Modal.Body>
            <Modal.Footer>
              <UserModalFooter formId="resetPasswordForm" onClose={handleClose} />
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default ResetPasswordDialog;
