import { Modal, Button, Checkbox, Label, useOverlayState } from "@heroui/react";
import { useEffect, useImperativeHandle, useState } from "react";
import { RoleType } from "@/types/role.type";
import { MENU, PERMISSION_VALUE } from "@/constants";
import { updateRole } from "@/app/(app)/role/actions";
import useToast from "../../_hooks/use-toast";
import { togglePermission } from "@/utils/rbac.utils";
import { PermissionKey } from "@/types/auth.types";
import { useAuth } from "../../_providers/authProvider";

export interface AssignPermissionDialogRef {
  handleOpen: () => void;
  handleClose: () => void;
}
interface AssignPermissionDialogProps {
  ref?: React.ForwardedRef<AssignPermissionDialogRef>;
  item?: RoleType;
}

const AssignPermissionDialog = ({ ref, item }: AssignPermissionDialogProps) => {
  const state = useOverlayState();
  const [selectedRole, setSelectedRole] = useState<RoleType>();
  const { toast } = useToast();
  const { setAuthSession } = useAuth();

  const handleAssignPermission = (menu: string, permission: PermissionKey) => {
    if (!selectedRole) return;
    const permissions = selectedRole?.permissions?.[menu] || 0;
    const newPermission = togglePermission(permissions, permission);
    setSelectedRole({ ...selectedRole, permissions: { ...selectedRole?.permissions, [menu]: newPermission } });
  };

  const onSubmit = async () => {
    if (!selectedRole) return;
    const data = { ...selectedRole, permissions: JSON.stringify(selectedRole.permissions), id: item?.id };
    const res = await updateRole(data);
    if (res.status === 200) {
      toast.success({ title: "Success", message: "Role updated successfully" });
      state.close();
    } else {
      toast.error({ title: "Error", message: "Role updated failed" });
    }
  };

  useEffect(() => { setSelectedRole(item); }, [item]);

  useImperativeHandle(ref, () => ({
    handleOpen: () => state.open(),
    handleClose: () => state.close(),
  }), []);

  if (!selectedRole) return null;

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Roles: {selectedRole.name}</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
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
                            <Checkbox
                              key={permission}
                              isSelected={!!(permissions & _permission)}
                              onChange={() => handleAssignPermission(menu.key, permission)}
                            >
                              <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                              <Checkbox.Content><Label>{permission}</Label></Checkbox.Content>
                            </Checkbox>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={() => state.close()}>Close</Button>
              <Button className="hover:bg-emerald-500 hover:text-white font-semibold" onPress={onSubmit}>Save</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AssignPermissionDialog;
