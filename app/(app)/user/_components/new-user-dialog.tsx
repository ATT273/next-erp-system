"use client";

import { useState } from "react";
import { Button, Modal, useOverlayState } from "@heroui/react";
import NewUserForm from "./new-user-form";
import { IFormUser } from "@/types/user.type";
import { createUser } from "../actions";
import useToast from "../../_hooks/use-toast";

export const NewUser = () => {
  const state = useOverlayState();
  const { toast } = useToast();

  const handleSubmit = async (data: IFormUser) => {
    const result = await createUser(data);
    if (result.status === 201) {
      toast.success({ title: "Success", message: "User has been created successfully" });
      state.close();
    } else {
      toast.error({ title: "Fail", message: `Failed to create user: ${result.message}` });
    }
  };

  return (
    <div className="w-full flex justify-end">
      <Modal state={state}>
        <Button onPress={() => state.open()}>Add new user</Button>
        <Modal.Backdrop>
          <Modal.Container size="lg">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Body>
                <NewUserForm setOpen={() => state.close()} handleSubmit={handleSubmit} />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
};

export default NewUser;
