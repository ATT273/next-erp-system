"use client";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { useImperativeHandle } from "react";

export interface AlertDialogRef {
  handleOpen: () => void;
  handleClose: () => void;
}
interface AlertDialogProps {
  ref?: React.ForwardedRef<AlertDialogRef>;
  title?: string;
  description?: string;
  onConfirm?: () => void;
}
const AlertDialog = ({ ref, title, description, onConfirm }: AlertDialogProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpen = () => {
    onOpen();
  };
  const handleClose = () => {
    onClose();
  };
  useImperativeHandle(
    ref,
    () => ({
      handleOpen,
      handleClose,
    }),
    []
  );

  return (
    <Modal isOpen={isOpen} size="xl" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title ?? "Alert"}</ModalHeader>
            <ModalBody>
              <p className="text-slate-900 mb-2">{description ?? "Are you sure you want to make this action?"}</p>
            </ModalBody>
            <ModalFooter>
              <div className="flex gap-2 w-full justify-end">
                <Button onPress={onClose} className="grid place-items-center size-8 p-0 text-slate-900">
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  color="danger"
                  onPress={onConfirm}
                  className="grid place-items-center size-8 text-white"
                >
                  Confirm
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AlertDialog;
