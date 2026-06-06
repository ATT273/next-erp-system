"use client";
import { IUserResponse } from "@/types/user.type";
import { Table } from "@heroui/react";
import { useUserContext } from "../_context/user-provider";
import { PenBox, Trash2, RefreshCw } from "lucide-react";
import { deleteUser } from "../actions";
import useToast from "@/app/(app)/_hooks/use-toast";
import EditUserDialog from "./edit-user-dialog";
import { useCallback, useRef, useState } from "react";
import ResetPasswordDialog from "./reset-password-dialog";
import { TableActionMenuItem } from "@/types/table.type";
import TableActionMenu from "@/components/customs/table-context-menu";
import AlertDialog, { AlertDialogRef } from "@/components/ui/AlertDialog";

const columns = [
  { key: "name", label: "NAME" },
  { key: "dob", label: "DOB" },
  { key: "email", label: "EMAIL" },
  { key: "role", label: "ROLE" },
  { key: "status", label: "STATUS" },
  { key: "action", label: "" },
];

const UserTable = ({ data }: { data: IUserResponse[] | null }) => {
  const { roles, setEditingUser } = useUserContext();
  const { toast } = useToast();
  const [opened, setOpened] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string>("");
  const deleteAlertRef = useRef<AlertDialogRef>(null);

  const handleEdit = (item: IUserResponse) => { setEditingUser(item); setOpened(true); };

  const handleDelete = async () => {
    const result = await deleteUser(toDeleteId);
    if (result.status === 200) {
      toast.success({ title: "Success", message: "User deleted successfully" });
    } else {
      toast.error({ title: "Failed", message: "Failed to delete user" });
    }
  };

  const onConfirmDelete = (id: string) => { setToDeleteId(id); deleteAlertRef.current?.handleOpen(); };
  const handleResetPassword = (item: IUserResponse) => { setEditingUser(item); setOpenPasswordDialog(true); };

  const generateActionMenu = useCallback((item: IUserResponse): TableActionMenuItem[] => [
    { key: "edit", title: "Edit", onClick: () => handleEdit(item), icon: PenBox },
    { key: "reset-password", title: "Reset password", onClick: () => handleResetPassword(item), icon: RefreshCw },
    { key: "delete", title: "Delete", onClick: () => onConfirmDelete(item.id), icon: Trash2 },
  ], []);

  return (
    <>
      <Table aria-label="user table" className="table-fixed min-w-full">
        <Table.ScrollContainer>
          <Table.Content aria-label="user table">
            <Table.Header>
              {columns.map((column) => (
                <Table.Column key={column.key}><div>{column.label}</div></Table.Column>
              ))}
            </Table.Header>
            <Table.Body>
              {data && data.length > 0 ? (
                data.map((item) => {
                  const actionMenuItems = generateActionMenu(item);
                  const role = roles.find((role) => role.code === item.roleCode);
                  return (
                    <Table.Row key={item.id} id={item.id}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.dob}</Table.Cell>
                      <Table.Cell>{item.email}</Table.Cell>
                      <Table.Cell>{role?.name}</Table.Cell>
                      <Table.Cell>
                        {item.active
                          ? <div className="size-4 bg-green-500 rounded-full" />
                          : <div className="size-4 bg-gray-300 rounded-full" />}
                      </Table.Cell>
                      <Table.Cell className="max-w-[50px]">
                        <TableActionMenu menuItems={actionMenuItems} resource="user" />
                      </Table.Cell>
                    </Table.Row>
                  );
                })
              ) : (
                <Table.Row id="empty">
                  <Table.Cell colSpan={columns.length}>No data available</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
      <AlertDialog ref={deleteAlertRef} title="Delete user" onConfirm={handleDelete} />
      <EditUserDialog opened={opened} setOpened={setOpened} />
      <ResetPasswordDialog opened={openPasswordDialog} setOpened={setOpenPasswordDialog} />
    </>
  );
};

export default UserTable;
