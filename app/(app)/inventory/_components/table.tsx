"use client";
import { useEffect, useRef, useState } from "react";
import { IInventoryFilterParams, InventoryItem, IResponseInventoryDetail } from "@/types/inventory.type";
import EditIcon from "@/components/icons/edit";
import Trash from "@/components/icons/trash";
import ThreeDots from "@/components/icons/three-dot";
import { deleteInventory, getInventoryDetails } from "../actions";
import { formatCurrency } from "@/utils/common.util";
import useToast from "@/app/(app)/_hooks/use-toast";
import { useInventoryStore } from "../_store/inventory-store";
import useGetInventories, { INVENTORY_QUERY_KEY } from "../_hooks/useGetInventories";
import { CHANGE_TYPE_LABELS } from "@/constants/dashboard.constants";
import { Button } from "@heroui/button";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Chip } from "@heroui/react";
import { ChipColor } from "@/types/heroui.types";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import CustomPagination from "@/components/ui/Pagination";
import AlertDialog, { AlertDialogRef } from "@/components/ui/AlertDialog";
import NewInventoryForm, { InventoryDialogRef } from "./modal/new-inventory-modal";
import { useQueryClient } from "@tanstack/react-query";
import { LIMIT } from "@/constants/response.constants";

const columns = [
  {
    key: "id",
    label: "ID",
    styles: "w-[50px] truncate",
  },
  {
    key: "product-name",
    label: "PRODUCT NAME",
    styles: "truncate",
  },
  {
    key: "sku",
    label: "SKU",
    styles: "w-[130px] truncate text-center",
  },
  {
    key: "quantity",
    label: "Quantity",
    styles: "max-w-[80px] w-[80px] truncate text-right",
  },
  {
    key: "type",
    label: "Change TYPE",
    styles: "w-[100px] truncate text-center",
  },
  {
    key: "ref-order",
    label: "Ref Order",
    styles: "w-[100px] truncate",
  },
  {
    key: "note",
    label: "Note",
    styles: "w-[200px] truncate",
  },
  {
    key: "edit",
    label: "Action",
    styles: "w-[50px]",
  },
];

const initialItem = {
  _id: "",
  name: "",
  price: 0,
  qty: 0,
  mainCategory: 0,
  subCategory: 0,
  unit: "",
  description: "",
  importPrice: 0,
  sizes: [],
};
export type InitialItemType = typeof initialItem;
const InventoryTable = () => {
  const { toast } = useToast();
  const [deletedProduct, setDeletedProduct] = useState<string>("");
  const [searchParams, setSearchParams] = useState<IInventoryFilterParams>({
    page: 1,
    limit: LIMIT,
    keyword: "",
  });

  // dialog ref
  const deleteAlertRef = useRef<AlertDialogRef>(null);
  const inventoryDialogRef = useRef<InventoryDialogRef>(null);
  // hooks
  const { inventoriesData, meta } = useGetInventories({
    params: searchParams,
  });
  const queryClient = useQueryClient();
  const { setSelectedId, setInventoryDetails, selectedInventoryId } = useInventoryStore();

  const getDetails = async () => {
    const result = await getInventoryDetails(selectedInventoryId);
    if (result.status === 200) {
      setInventoryDetails(result.data!);
    }
    // if (result.data) setInventoryDetails(result.data);
  };

  const handleDeleteProduct = async (id: string) => {
    const result = await deleteInventory(id);
    if (result.status === 200) {
      deleteAlertRef.current?.handleClose();
      setDeletedProduct("");
      toast.success({
        title: "Success",
        message: "Product deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: [INVENTORY_QUERY_KEY] });
    } else {
      toast.error({
        title: "Fail",
        message: `Failed to delete product: ${result.message}`,
      });
    }
  };

  const onPageChange = (value: number) => {
    setSearchParams((prev) => ({ ...prev, page: value }));
  };

  useEffect(() => {
    if (selectedInventoryId) {
      getDetails();
    } else {
      setInventoryDetails({} as IResponseInventoryDetail);
    }
  }, [selectedInventoryId]);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex-1 overflow-y-auto">
        <Table aria-label="Inventory list">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key} className={column.styles}>
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {inventoriesData && inventoriesData.length > 0 ? (
              inventoriesData.map((item, index) => {
                const chipColor =
                  CHANGE_TYPE_LABELS[item.changeType as keyof typeof CHANGE_TYPE_LABELS]?.color ?? "default";
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-[50px] truncate">{item.id}</div>
                    </TableCell>
                    <TableCell>
                      <div className="w-[200px] truncate">{item.productName}</div>
                    </TableCell>
                    <TableCell>
                      <div className="w-[130px] truncate text-center">{item.skuCode}</div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(item.qtyChange)}</TableCell>
                    <TableCell>
                      <div className=" flex justify-center">
                        <Chip color={chipColor as ChipColor}>{item.changeType}</Chip>
                      </div>
                      {/* <div className="w-[150px] truncate">{item.changeType}</div> */}
                    </TableCell>
                    <TableCell>
                      <div className="w-[100px] truncate">{item.refOrderId}</div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-[200px] truncate">{item.note}</div>
                    </TableCell>
                    <TableCell>
                      <Dropdown>
                        <DropdownTrigger className="!p-0">
                          <Button variant="bordered" isIconOnly className="!p-0 ">
                            <ThreeDots className="text-slate-900 size-4" />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                          <DropdownItem
                            key="edit"
                            startContent={<EditIcon className="text-teal-500 size-4" />}
                            onPress={() => {
                              setSelectedId(item.id);
                              inventoryDialogRef.current?.handleOpen();
                            }}
                          >
                            <p className="text-slate-900 ml-2">Edit</p>
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            className="text-danger"
                            color="danger"
                            startContent={<Trash className="text-red-500 size-4" />}
                            onPress={() => {
                              deleteAlertRef.current?.handleOpen();
                              setDeletedProduct(item.id);
                            }}
                          >
                            <p className="text-slate-900 ml-2">Delete</p>
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
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
        onConfirm={() => {
          handleDeleteProduct(deletedProduct);
        }}
      />
      <NewInventoryForm ref={inventoryDialogRef} />
    </div>
  );
};

export default InventoryTable;
