import { Modal, useOverlayState } from "@heroui/react";
import NewUserForm from "./new-user-form";
import { useUserContext } from "../_context/user-provider";
import useToast from "../../_hooks/use-toast";
import { IFormUser } from "@/types/user.type";
import { updateUser } from "../actions";
import { useEffect } from "react";

interface EditUserDialogProps {
  opened: boolean;
  setOpened: (open: boolean) => void;
}

const EditUserDialog = ({ opened, setOpened }: EditUserDialogProps) => {
  const { editingUser } = useUserContext();
  const { toast } = useToast();
  const state = useOverlayState({ isOpen: opened, onOpenChange: setOpened });

  const handleSubmit = async (data: IFormUser) => {
    const result = await updateUser(editingUser?.id!, data);
    if (result.status === 200) {
      toast.success({ title: "Success", message: "User has been updated successfully" });
      setOpened(false);
    } else {
      toast.error({ title: "Fail", message: `Failed to update user: ${result.message}` });
    }
  };

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Body>
              <NewUserForm setOpen={setOpened} initialData={editingUser} handleSubmit={handleSubmit} />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditUserDialog;
