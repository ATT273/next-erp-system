"use client";
import { Button, Modal, useOverlayState } from "@heroui/react";
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
  const state = useOverlayState();

  useImperativeHandle(
    ref,
    () => ({
      handleOpen: () => state.open(),
      handleClose: () => state.close(),
    }),
    []
  );

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>{title ?? "Alert"}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-slate-900 mb-2">
                {description ?? "Are you sure you want to make this action?"}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex gap-2 w-full justify-end">
                <Button
                  onPress={() => state.close()}
                  className="grid place-items-center size-8 p-0 text-slate-900"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onPress={onConfirm}
                  className="grid place-items-center size-8 text-white"
                >
                  Confirm
                </Button>
              </div>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AlertDialog;
