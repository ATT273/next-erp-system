import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Button, Checkbox } from "@heroui/react";
import { useEffect, useImperativeHandle, useState } from "react";
import { RoleType } from "@/types/role.type";
import { MENU, PERMISSION_VALUE } from "@/constants";
import { updateRole } from "@/app/(app)/role/actions";
import useToast from "../../_hooks/use-toast";
import { togglePermission } from "@/utils/rbac.utils";
import { PermissionKey } from "@/types/auth.types";

export interface AssignPermissionDialogRef {
  handleOpen: () => void;
  handleClose: () => void;
}
interface AssignPermissionDialogProps {
  ref?: React.ForwardedRef<AssignPermissionDialogRef>;
  item?: RoleType;
}

const AssignPermissionDialog = ({ ref, item }: AssignPermissionDialogProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRole, setSelectedRole] = useState<RoleType>();
  const { toast } = useToast();

  const handleAssignPermission = (menu: string, permission: PermissionKey) => {
    if (!selectedRole) return;

    const permissions = selectedRole?.permissions?.[menu] || 0;
    const newPermission = togglePermission(permissions, permission);

    setSelectedRole({ ...selectedRole, permissions: { ...selectedRole?.permissions, [menu]: newPermission } });
  };

  const onSubmit = async () => {
    if (!selectedRole) return;
    const data = {
      ...selectedRole,
      permissions: JSON.stringify(selectedRole.permissions),
      id: item?.id,
    };

    const res = await updateRole(data);
    if (res.status === 200) {
      toast.success({
        title: "Success",
        message: "Role updated successfully",
      });
      onClose();
    } else {
      toast.error({
        title: "Error",
        message: "Role updated failed",
      });
    }
  };

  useEffect(() => {
    setSelectedRole(item);
  }, [item]);

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

  if (!selectedRole) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Roles: {selectedRole.name}</ModalHeader>
            <ModalBody>
              <div className="max-h-[300px] flex flex-col gap-2">
                {MENU.map((menu) => {
                  const permissions = selectedRole.permissions[menu.key] || 0;
                  return (
                    <div className="flex gap-2" key={menu.key}>
                      <h3 className="font-semibold text-md min-w-[6rem]">{menu.title}</h3>
                      <div className="flex gap-2 px-3">
                        {menu.permissions.map((permission) => {
                          const _permission = PERMISSION_VALUE[permission as keyof typeof PERMISSION_VALUE];
                          return (
                            <div key={permission}>
                              <Checkbox
                                isSelected={!!(permissions & _permission)}
                                onChange={(e) => handleAssignPermission(menu.key, permission)}
                              >
                                {permission}
                              </Checkbox>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-end"></div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={onClose}>
                Close
              </Button>
              <Button className="hover:bg-emerald-500 hover:text-white font-semibold" onPress={onSubmit}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AssignPermissionDialog;
