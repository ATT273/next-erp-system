"use client";
import RoleTableRow from "./table-row";
import { RoleType } from "@/types/role.type";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import AssignPermissionDialog, { AssignPermissionDialogRef } from "./assign-role-dialog";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../_providers/authProvider";

const columns = [
  {
    key: "name",
    label: "NAME",
    class: "w-[12rem] text-left",
  },
  {
    key: "code",
    label: "CODE",
    class: "w-[10rem] text-left",
  },
  {
    key: "active",
    label: "Active",
    class: "w-[10rem] text-left",
  },
  {
    key: "description",
    label: "DESCRIPTION",
    class: "grow text-left",
  },
  {
    key: "role",
    label: "Assign Roles",
    class: "w-[5rem] text-center",
  },
  {
    key: "actions",
    label: "Actions",
    class: "w-[8rem] text-center",
  },
  {
    key: "delete",
    label: "Delete",
    class: "w-[5rem] text-center",
  },
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
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key} className={column.class}>
              {column.label}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody emptyContent="No data">
          {roles && roles.length > 0 ? (
            roles.map((item) =>
              RoleTableRow({
                item,
                openAssignRoleDialog: () => hanldeOpenAssignDialog(item),
              }),
            )
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length}>No data available</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AssignPermissionDialog ref={AssignRoleDialogRef} item={selectedRole} />
    </>
  );
};

export default RoleTable;
