"use client";

import { Modal, useOverlayState } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import NewUserForm from "@/app/(app)/user/_components/forms/NewUserForm";
import { useUserContext } from "@/app/(app)/user/_context/user-provider";
import useToast from "@/app/(app)/_hooks/use-toast";
import { IFormUser } from "@/types/user.type";
import { updateUser } from "@/app/(app)/user/actions";
import UserModalFooter from "@/app/(app)/user/_components/modals/user-modal/UserDialogFooter";

interface EditUserDialogProps {
  opened: boolean;
  setOpened: (open: boolean) => void;
}

const EditUserDialog = ({ opened, setOpened }: EditUserDialogProps) => {
  const { editingUser } = useUserContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = useOverlayState({ isOpen: opened, onOpenChange: setOpened });

  const handleClose = () => setOpened(false);

  const handleSubmit = async (data: IFormUser) => {
    const result = await updateUser(editingUser?.id!, data);
    if (result.status === 200) {
      toast.success({ title: "Success", message: "User has been updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      handleClose();
    } else {
      toast.error({ title: "Fail", message: `Failed to update user: ${result.message}` });
    }
  };

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog className="max-w-2xl max-h-full">
            <Modal.CloseTrigger onPress={handleClose} />
            <Modal.Header>
              <Modal.Heading>Edit user</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <NewUserForm initialData={editingUser} handleSubmit={handleSubmit} />
            </Modal.Body>
            <Modal.Footer>
              <UserModalFooter formId="userForm" onClose={handleClose} />
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditUserDialog;
