import { Modal, Button, useOverlayState } from "@heroui/react";
import { useEffect, useImperativeHandle, useMemo, useState } from "react";
import { RoleType } from "@/types/role.type";
import { RESOURCE_PERMISSIONS } from "@/constants";
import { assignPermissionToRole } from "@/app/(app)/role/actions";
import useToast from "../../_hooks/use-toast";
import { addPermission, removePermission } from "@/utils/rbac.utils";
import { Action, Resource } from "@/types/auth.types";
import { useAuth } from "../../_providers/authProvider";
import AvailablePermissionList from "./role-list/AvailablePermissionList";
import RolePermissionList from "./role-list/RolePermissionList";

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
  console.log("selectedRole", selectedRole);

  const rolePermissionMap: Map<Resource, string[]> = useMemo(() => {
    const rolePermissions = selectedRole?.permissions ? { ...selectedRole?.permissions } : undefined;

    const newMap = new Map();
    if (!rolePermissions) return newMap;
    const resources = Object.keys(rolePermissions);
    for (const r of resources) {
      newMap.set(
        r,
        rolePermissions[r as Resource]?.map((p) => `${r}:${p}`),
      );
    }
    return newMap;
  }, [selectedRole?.permissions]);

  const resourcePermissionMap: Map<Resource, string[]> = useMemo(() => {
    const resources = Object.keys(RESOURCE_PERMISSIONS);
    const newMap = new Map();
    for (const r of resources) {
      const assignedPermissions = rolePermissionMap.get(r as Resource) ?? [];
      const remainingPermissions = RESOURCE_PERMISSIONS[r as Resource]
        .map((p) => `${r}:${p}`)
        .filter((permissionKey) => !assignedPermissions.includes(permissionKey));
      newMap.set(r, remainingPermissions);
    }
    return newMap;
  }, [rolePermissionMap]);

  const handleAssignPermission = (permissionKey: string, action: string) => {
    if (!selectedRole) return;
    const [resource, permission] = permissionKey.split(":");
    const resourcePermissions = selectedRole.permissions?.[resource as Resource];
    const newPermissions = !resourcePermissions
      ? [permission as Action]
      : action === "assign"
        ? addPermission(resourcePermissions, permission as Action)
        : removePermission(resourcePermissions, permission as Action);

    setSelectedRole({
      ...selectedRole,
      permissions: {
        ...selectedRole.permissions,
        [resource]: newPermissions,
      },
    });
  };

  const assignAll = () => {
    if (!selectedRole) return;
    const allPermissions = Object.fromEntries(
      Object.entries(RESOURCE_PERMISSIONS).map(([resource, actions]) => [resource, [...actions]]),
    );
    setSelectedRole({ ...selectedRole, permissions: allPermissions });
  };

  const unassignAll = () => {
    if (!selectedRole) return;
    setSelectedRole({ ...selectedRole, permissions: {} });
  };

  const assignResourcePermission = (resource: Resource) => {
    if (!selectedRole) return;
    setSelectedRole({
      ...selectedRole,
      permissions: {
        ...selectedRole.permissions,
        [resource]: [...RESOURCE_PERMISSIONS[resource]],
      },
    });
  };

  const unassignResourcePermission = (resource: Resource) => {
    if (!selectedRole) return;
    const newPermissions = { ...selectedRole.permissions };
    delete newPermissions[resource];
    setSelectedRole({ ...selectedRole, permissions: newPermissions });
  };

  const onSubmit = async () => {
    if (!selectedRole) return;
    const res = await assignPermissionToRole({
      role: selectedRole.code,
      permissions: selectedRole.permissions,
    });
    if (res.status === 200) {
      toast.success({ title: "Success", message: "Role updated successfully" });
      state.close();
    } else {
      toast.error({ title: "Error", message: "Role updated failed" });
    }
  };

  useEffect(() => {
    setSelectedRole(item);
  }, [item]);

  useImperativeHandle(
    ref,
    () => ({
      handleOpen: () => state.open(),
      handleClose: () => state.close(),
    }),
    [],
  );

  if (!selectedRole) return null;

  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-2xl w-[700px] h-[500px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Roles: {selectedRole.name}</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="w-full">
              <div className="flex flex-row h-full gap-2">
                <AvailablePermissionList
                  key="available-permission-list"
                  permissionsMap={resourcePermissionMap}
                  assignAll={assignAll}
                  assignResourcePermission={assignResourcePermission}
                  handleAssignPermission={handleAssignPermission}
                />
                <RolePermissionList
                  key="role-permission-list"
                  permissionsMap={rolePermissionMap}
                  unassignAll={unassignAll}
                  unassignResourcePermission={unassignResourcePermission}
                  handleAssignPermission={handleAssignPermission}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={() => state.close()}>Close</Button>
              <Button className="font-semibold hover:bg-emerald-500 hover:text-white" onPress={onSubmit}>
                Save
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default AssignPermissionDialog;
