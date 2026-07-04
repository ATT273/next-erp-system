"use client";
import RoleTableRow from "./table-row";
import { RoleType } from "@/types/role.type";
import { Table } from "@heroui/react";
import AssignPermissionDialog, { AssignPermissionDialogRef } from "./assign-role-dialog";
import RoleDialog, { RoleDialogRef } from "./new-role-dialog";
import { useRef, useState } from "react";
import { GetRolesListData } from "@/types/responses/role.response";

const columns = [
  { key: "name", label: "NAME", class: "w-[12rem] text-left" },
  { key: "code", label: "CODE", class: "w-[10rem] text-left" },
  { key: "active", label: "Active", class: "w-[10rem] text-left" },
  { key: "description", label: "DESCRIPTION", class: "grow text-left" },
  { key: "role", label: "Assign Roles", class: "w-[5rem] text-center" },
  { key: "actions", label: "Actions", class: "w-[8rem] text-center" },
  { key: "delete", label: "Delete", class: "w-[5rem] text-center" },
];

const RoleTable = ({ roles }: { roles: GetRolesListData[] }) => {
  const AssignRoleDialogRef = useRef<AssignPermissionDialogRef>(null);
  const EditRoleDialogRef = useRef<RoleDialogRef>(null);
  const [assignTarget, setAssignTarget] = useState<RoleType>();
  const [editingItem, setEditingItem] = useState<GetRolesListData>();

  const handleOpenAssignDialog = (item: RoleType) => {
    setAssignTarget(item);
    AssignRoleDialogRef.current?.handleOpen();
  };

  const handleOpenEditDialog = (item: GetRolesListData) => {
    setEditingItem(item);
    EditRoleDialogRef.current?.handleOpen(item);
  };

  return (
    <>
      <Table aria-label="Role list" className="p-2">
        <Table.ScrollContainer>
          <Table.Content aria-label="Role list" selectionMode="none">
            <Table.Header>
              {columns.map((column) => (
                <Table.Column key={column.key} className={column.class} isRowHeader={column.key === "name"}>
                  {column.label}
                </Table.Column>
              ))}
            </Table.Header>
            <Table.Body items={roles ?? []}>
              {(item) => (
                <RoleTableRow
                  key={item.id}
                  item={item}
                  openAssignRoleDialog={() => handleOpenAssignDialog(item)}
                  openEditDialog={() => handleOpenEditDialog(item)}
                />
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <AssignPermissionDialog ref={AssignRoleDialogRef} item={assignTarget} />
      <RoleDialog ref={EditRoleDialogRef} item={editingItem} />
    </>
  );
};

export default RoleTable;
