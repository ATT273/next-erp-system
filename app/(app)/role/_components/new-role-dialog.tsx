"use client";
import { Modal, Button, TextField, Label, Input, useOverlayState } from "@heroui/react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForwardedRef, useEffect, useImperativeHandle, useMemo } from "react";
import { z } from "zod";
import { RESOURCE_PERMISSIONS } from "@/constants";
import { RoleType } from "@/types/role.type";
import { Action, Resource } from "@/types/auth.types";
import { createRole, updateRole } from "@/app/(app)/role/actions";
import { addPermission, removePermission, canEdit } from "@/utils/rbac.utils";
import { useAuth } from "../../_providers/authProvider";
import useToast from "../../_hooks/use-toast";
import AvailablePermissionList from "./role-list/AvailablePermissionList";
import RolePermissionList from "./role-list/RolePermissionList";
import { GetRolesListData } from "@/types/responses/role.response";

const formInfoSchema = z.object({
  name: z.string().min(6, { message: "Name must be at least 6 characters" }),
  code: z.string().min(3, { message: "Code must be at least 3 characters" }),
  description: z.string().optional(),
  permissions: z.object({}).optional(),
});

const initialValues: RoleType = {
  name: "",
  description: "",
  code: "",
  active: true,
  permissions: {},
};

export interface RoleDialogRef {
  handleOpen: (item?: GetRolesListData) => void;
  handleClose: () => void;
}

interface RoleDialogProps {
  ref?: ForwardedRef<RoleDialogRef>;
  item?: GetRolesListData;
}

const RoleDialog = ({ ref, item }: RoleDialogProps) => {
  const { toast } = useToast();
  const state = useOverlayState();
  const { authSession } = useAuth();
  const _canEdit = useMemo(() => {
    if (!authSession?.permissions) return false;
    return canEdit(authSession.permissions, "role");
  }, [authSession?.permissions]);

  const formInfo = useForm<GetRolesListData & { id?: string }>({
    defaultValues: initialValues,
    resolver: zodResolver(formInfoSchema),
  });

  const watchedPermissions = useWatch({ name: "permissions", control: formInfo.control });

  const rolePermissionMap: Map<Resource, string[]> = useMemo(() => {
    const rolePermissions = watchedPermissions ? { ...watchedPermissions } : undefined;
    const newMap = new Map();
    if (!rolePermissions) return newMap;
    for (const r of Object.keys(rolePermissions)) {
      newMap.set(
        r,
        rolePermissions[r as Resource]?.map((p) => `${r}:${p}`),
      );
    }
    return newMap;
  }, [watchedPermissions]);

  const resourcePermissionMap: Map<Resource, string[]> = useMemo(() => {
    const newMap = new Map();
    for (const r of Object.keys(RESOURCE_PERMISSIONS)) {
      const assigned = rolePermissionMap.get(r as Resource) ?? [];
      newMap.set(
        r,
        RESOURCE_PERMISSIONS[r as Resource].map((p) => `${r}:${p}`).filter((k) => !assigned.includes(k)),
      );
    }
    return newMap;
  }, [rolePermissionMap]);

  const handleAssignPermission = (permissionKey: string, action: string) => {
    const [resource, permission] = permissionKey.split(":") as [Resource, Action];
    const perms = formInfo.getValues("permissions");
    const resourcePermissions = perms[resource] ?? [];
    const newPermissions =
      action === "assign"
        ? addPermission(resourcePermissions, permission)
        : removePermission(resourcePermissions, permission);
    formInfo.setValue("permissions", { ...perms, [resource]: newPermissions });
  };

  const assignAll = () =>
    formInfo.setValue(
      "permissions",
      Object.fromEntries(Object.entries(RESOURCE_PERMISSIONS).map(([r, a]) => [r, [...a]])),
    );

  const unassignAll = () => formInfo.setValue("permissions", {});

  const assignResourcePermission = (resource: Resource) => {
    const perms = formInfo.getValues("permissions");
    formInfo.setValue("permissions", { ...perms, [resource]: [...RESOURCE_PERMISSIONS[resource]] });
  };

  const unassignResourcePermission = (resource: Resource) => {
    const perms = { ...formInfo.getValues("permissions") };
    delete perms[resource];
    formInfo.setValue("permissions", perms);
  };

  const handleSubmit = async (values: RoleType & { id?: string }) => {
    if (item?.id) {
      const res = await updateRole({
        id: item.id,
        name: values.name,
        code: values.code,
        active: values.active,
        description: values.description ?? "",
      });
      if (res.status === 200) {
        toast.success({ title: "Success", message: "Role updated successfully" });
        state.close();
      } else {
        toast.error({ title: "Failed", message: res.message });
      }
    } else {
      const res = await createRole(values);
      if (res.status === 200) {
        toast.success({ title: "Success", message: "Role created successfully" });
        state.close();
      } else {
        toast.error({ title: "Failed", message: res.message });
      }
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      handleOpen: () => {
        state.open();
      },
      handleClose: () => state.close(),
    }),
    [],
  );

  useEffect(() => {
    if (item) {
      formInfo.reset({
        id: item.id,
        code: item.code,
        name: item.name,
        active: item.active,
        description: item.description,
      });
    }
  }, [item]);
  const isEditMode = !!formInfo.watch("id" as any);

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="cover">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {isEditMode ? "Edit role" : "Add new role"} {}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <form
                id="role-form"
                onSubmit={formInfo.handleSubmit(handleSubmit)}
                className="flex flex-col items-center gap-3 py-2 overflow-y-auto"
              >
                <div className="flex flex-col w-full gap-2 p-2">
                  <Controller
                    name="name"
                    control={formInfo.control}
                    render={({ field, fieldState }) => (
                      <TextField isRequired type="text" isInvalid={!!fieldState.error} className="w-full" {...field}>
                        <Label>Role name</Label>
                        <Input placeholder="Enter role name" />
                      </TextField>
                    )}
                  />
                  <Controller
                    name="description"
                    control={formInfo.control}
                    render={({ field, fieldState }) => (
                      <TextField isInvalid={!!fieldState.error} className="w-full" {...field}>
                        <Label>Role description</Label>
                        <Input placeholder="Enter role description" />
                      </TextField>
                    )}
                  />
                  <Controller
                    name="code"
                    control={formInfo.control}
                    render={({ field, fieldState }) => (
                      <TextField isRequired type="text" isInvalid={!!fieldState.error} className="w-full" {...field}>
                        <Label>Role code</Label>
                        <Input placeholder="Enter role code" />
                      </TextField>
                    )}
                  />
                </div>
                <div className="w-full p-2 max-h-[450px] overflow-hidden">
                  <h3 className="mb-3 text-lg font-semibold">Permissions</h3>
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
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onPress={() => state.close()}>
                Close
              </Button>
              <Button type="submit" form="role-form" className="bg-emerald-500">
                Save
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default RoleDialog;
