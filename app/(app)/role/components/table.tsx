"use client";
import RoleTableRow from "./table-row";
import { RoleType } from "@/types/role.type";
import { Table } from "@heroui/react";
import AssignPermissionDialog, { AssignPermissionDialogRef } from "./assign-role-dialog";
import { useRef, useState } from "react";
import { useAuth } from "../../_providers/authProvider";

const columns = [
  { key: "name", label: "NAME", class: "w-[12rem] text-left" },
  { key: "code", label: "CODE", class: "w-[10rem] text-left" },
  { key: "active", label: "Active", class: "w-[10rem] text-left" },
  { key: "description", label: "DESCRIPTION", class: "grow text-left" },
  { key: "role", label: "Assign Roles", class: "w-[5rem] text-center" },
  { key: "actions", label: "Actions", class: "w-[8rem] text-center" },
  { key: "delete", label: "Delete", class: "w-[5rem] text-center" },
];

const RoleTable = ({ roles }: { roles: RoleType[] }) => {
  const AssignRoleDialogRef = useRef<AssignPermissionDialogRef>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType>();
  const { authSession } = useAuth();

  const hanldeOpenAssignDialog = (item: RoleType) => {
    setSelectedRole(item);
    AssignRoleDialogRef.current?.handleOpen();
  };

  return (
    <>
      <Table aria-label="Role list" className="p-2">
        <Table.ScrollContainer>
          <Table.Content aria-label="Role list">
            <Table.Header>
              {columns.map((column) => (
                <Table.Column key={column.key} className={column.class}>
                  {column.label}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {roles && roles.length > 0 ? (
                roles.map((item) =>
                  RoleTableRow({ item, openAssignRoleDialog: () => hanldeOpenAssignDialog(item) })
                )
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={columns.length}>No data available</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <AssignPermissionDialog ref={AssignRoleDialogRef} item={selectedRole} />
    </>
  );
};

export default RoleTable;
