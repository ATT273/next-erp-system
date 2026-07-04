"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import EditIcon from "@/components/icons/edit";
import Trash from "@/components/icons/trash";
import ThreeDots from "@/components/icons/three-dot";
import { deleteInventory, getInventoryDetails } from "../actions";
import { formatCurrency } from "@/utils/common.util";
import useToast from "@/app/(app)/_hooks/use-toast";
import { useInventoryStore } from "../_store/inventory-store";
import useGetInventories, { INVENTORY_QUERY_KEY } from "../_hooks/useGetInventories";
import { CHANGE_TYPE_LABELS } from "@/constants/dashboard.constants";
import { Button, Table, Chip, Dropdown, Label } from "@heroui/react";

import CustomPagination from "@/components/customs/Pagination";
import AlertDialog, { AlertDialogRef } from "@/components/customs/AlertDialog";
import NewInventoryForm, { InventoryDialogRef } from "./modal/new-inventory-modal";
import { useQueryClient } from "@tanstack/react-query";
import TableContextMenu from "@/components/customs/TableContextMenu";
import { TableActionMenuItem } from "@/types/table.type";
import { PenBox, Trash2 } from "lucide-react";
import { InventoryItemType } from "@/types/responses/inventory.response";

const columns = [
  { key: "id", label: "ID", styles: "w-[50px] truncate" },
  { key: "product-name", label: "PRODUCT NAME", styles: "truncate" },
  { key: "sku", label: "SKU", styles: "w-[130px] truncate text-center" },
  { key: "quantity", label: "Quantity", styles: "max-w-[80px] w-[80px] truncate text-right" },
  { key: "type", label: "Change TYPE", styles: "w-[100px] truncate text-center" },
  { key: "ref-order", label: "Ref Order", styles: "w-[100px] truncate" },
  { key: "note", label: "Note", styles: "w-[200px] truncate" },
  { key: "edit", label: "Action", styles: "w-[50px]" },
];

const InventoryTable = () => {
  const { toast } = useToast();
  const [deletedProduct, setDeletedProduct] = useState<string>("");
  const deleteAlertRef = useRef<AlertDialogRef>(null);
  const inventoryDialogRef = useRef<InventoryDialogRef>(null);
  const { inventoriesData, meta, getInventoriesData } = useGetInventories();
  const queryClient = useQueryClient();
  const { setSelectedId, setInventoryDetails, selectedInventoryId } = useInventoryStore();

  const getDetails = async () => {
    const result = await getInventoryDetails(selectedInventoryId);
    if (result.status === 200) setInventoryDetails(result.data!);
  };

  const handleDeleteProduct = async (id: string) => {
    const result = await deleteInventory(id);
    if (result.status === 200) {
      deleteAlertRef.current?.handleClose();
      setDeletedProduct("");
      toast.success({ title: "Success", message: "Product deleted successfully" });
      queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
    } else {
      toast.error({ title: "Fail", message: `Failed to delete product: ${result.message}` });
    }
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    inventoryDialogRef.current?.handleOpen();
  };

  const onConfirmDelete = (id: string) => {
    setDeletedProduct(id);
    deleteAlertRef.current?.handleOpen();
  };
  const generateActionMenu = useCallback(
    (item: InventoryItemType): TableActionMenuItem[] => [
      { key: "edit", title: "Edit", onClick: () => handleEdit(item.id), icon: PenBox },
      { key: "delete", title: "Delete", onClick: () => onConfirmDelete(item.id), icon: Trash2 },
    ],
    [],
  );

  const onPageChange = (value: number) => getInventoriesData({ page: value, limit: meta.limit });

  useEffect(() => {
    if (selectedInventoryId) getDetails();
    else setInventoryDetails(null);
  }, [selectedInventoryId]);

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex-1 overflow-y-auto">
        <Table aria-label="Inventory list">
          <Table.ScrollContainer>
            <Table.Content aria-label="Inventory list" selectionMode="none">
              <Table.Header>
                {columns.map((column) => {
                  return (
                    <Table.Column
                      key={column.key}
                      className={column.styles}
                      isRowHeader={column.key === "product-name"}
                    >
                      {column.label}
                    </Table.Column>
                  );
                })}
              </Table.Header>
              <Table.Body>
                {inventoriesData && inventoriesData.length > 0 ? (
                  inventoriesData.map((item) => {
                    const chipColor =
                      CHANGE_TYPE_LABELS[item.changeType as keyof typeof CHANGE_TYPE_LABELS]?.color ?? "default";
                    return (
                      <Table.Row key={item.id} id={item.id}>
                        <Table.Cell>
                          <div className="w-[50px] truncate">{item.id}</div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="w-[200px] truncate">{item.productName}</div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="w-[130px] truncate text-center">{item.skuCode}</div>
                        </Table.Cell>
                        <Table.Cell className="text-right">{formatCurrency(item.qtyChange)}</Table.Cell>
                        <Table.Cell>
                          <div className="flex justify-center">
                            <Chip color={chipColor as any}>{item.changeType}</Chip>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="w-[100px] truncate">{item.refOrderId}</div>
                        </Table.Cell>
                        <Table.Cell>
                          <div className="min-w-[200px] truncate">{item.note}</div>
                        </Table.Cell>
                        <Table.Cell>
                          <TableContextMenu menuItems={generateActionMenu(item)} resource="product" />
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                ) : (
                  <Table.Row id="empty">
                    <Table.Cell colSpan={8} className="text-center">
                      No inventory found
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
      <CustomPagination
        showControls
        total={meta.totalPages}
        initialPage={Number(meta.page)}
        onChange={onPageChange}
        className="flex justify-end"
      />
      <AlertDialog
        ref={deleteAlertRef}
        title="Delete inventory"
        description="Are you sure you want to delete this inventory?"
        onConfirm={() => handleDeleteProduct(deletedProduct)}
      />
      <NewInventoryForm ref={inventoryDialogRef} />
    </div>
  );
};

export default InventoryTable;
