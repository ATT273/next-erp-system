"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import NewUserForm from "@/app/(app)/user/_components/forms/NewUserForm";
import { IFormUser } from "@/types/user.type";
import { createUser } from "@/app/(app)/user/actions";
import useToast from "@/app/(app)/_hooks/use-toast";
import UserDialogFooter from "@/app/(app)/user/_components/modals/user-modal/UserDialogFooter";

export const NewUser = () => {
  const state = useOverlayState();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (data: IFormUser) => {
    const result = await createUser(data);
    if (result.status === 200) {
      toast.success({ title: "Success", message: "User has been created successfully" });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      state.close();
    } else {
      toast.error({ title: "Fail", message: `Failed to create user: ${result.message}` });
    }
  };

  return (
    <div className="flex justify-end w-full">
      <Modal state={state}>
        <Button onPress={() => state.open()}>Add new user</Button>
        <Modal.Backdrop isDismissable={false}>
          <Modal.Container size="lg">
            <Modal.Dialog className="max-w-2xl max-h-full">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Add new user</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <NewUserForm handleSubmit={handleSubmit} />
              </Modal.Body>
              <Modal.Footer>
                <UserDialogFooter formId="userForm" onClose={() => state.close()} />
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default NewUser;
