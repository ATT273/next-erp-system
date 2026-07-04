import React, { useMemo } from "react";
import { RoleType } from "@/types/role.type";
import { Button, Switch, Table } from "@heroui/react";
import Trash from "@/components/icons/trash";
import { PenBox, ShieldUser } from "lucide-react";
import { useAuth } from "../../_providers/authProvider";
import { canAssign as canAssignRole, canDelete, canEdit } from "@/utils/rbac.utils";
import { GetRolesListData } from "@/types/responses/role.response";

const ACTION_BUTTON_STYLE = "bg-transparent text-emerald-600 hover:bg-emerald-500 hover:text-white";
const DELETE_BUTTON_STYLE = "bg-transparent text-red-600 hover:bg-red-500 hover:text-white";
const DISABLED_BUTTON_STYLE = "text-gray-500 cursor-default hover:bg-gray-300 hover:text-gray-500";

interface RoleTableRowProps {
  item: GetRolesListData;
  openAssignRoleDialog: () => void;
  openEditDialog: () => void;
}

const RoleTableRow = ({ item, openAssignRoleDialog, openEditDialog }: RoleTableRowProps) => {
  const { authSession } = useAuth();
  const permissions = authSession?.permissions;

  const _canEdit = useMemo(() => {
    if (!permissions) return false;
    return canEdit(permissions, "role");
  }, [permissions]);

  const _canDelete = useMemo(() => {
    if (!permissions) return false;
    return canDelete(permissions, "role");
  }, [permissions]);

  const _canAssign = useMemo(() => {
    if (!permissions) return false;
    return canAssignRole(permissions, "role");
  }, [permissions]);

  return (
    <Table.Row id={item.id}>
      <Table.Cell className="w-[12rem] text-left">{item.name}</Table.Cell>
      <Table.Cell className="w-[10rem] text-left">{item.code}</Table.Cell>
      <Table.Cell className="w-[10rem] text-left">
        <Switch isSelected={item.active} isDisabled>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
      </Table.Cell>
      <Table.Cell className="text-left grow">{item.description}</Table.Cell>
      <Table.Cell className="w-[3rem] text-center">
        <Button
          isIconOnly
          onPress={openAssignRoleDialog}
          className={`${ACTION_BUTTON_STYLE} ${!_canAssign ? DISABLED_BUTTON_STYLE : ""}`}
          isDisabled={!_canAssign}
        >
          <ShieldUser className="size-5" />
        </Button>
      </Table.Cell>
      <Table.Cell className="w-[8rem] text-center">
        <Button
          isIconOnly
          onPress={openEditDialog}
          className={`${ACTION_BUTTON_STYLE} ${!_canEdit ? DISABLED_BUTTON_STYLE : ""}`}
          isDisabled={!_canEdit}
        >
          <PenBox className="size-4" />
        </Button>
      </Table.Cell>
      <Table.Cell className="w-[3rem] text-center">
        <Button
          isIconOnly
          onPress={() => {}}
          className={`${DELETE_BUTTON_STYLE} ${!_canDelete ? DISABLED_BUTTON_STYLE : ""}`}
          isDisabled={!_canDelete}
        >
          <Trash className="size-5" />
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default RoleTableRow;
