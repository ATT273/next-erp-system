"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductResponseType, ProductType } from "@/types/product.type";
import EditIcon from "@/components/icons/edit";
import Trash from "@/components/icons/trash";
import ThreeDots from "@/components/icons/three-dot";
import { mainCategory, subCategory } from "@/constants";
import { deleteProduct, getProductDetails } from "../actions";
import { formatCurrency } from "@/utils/common.util";
import useToast from "@/app/(app)/_hooks/use-toast";
import { useProductStore } from "../_store/product-store";
import EditProduct from "./drawer/product-detail-drawer";
import { Button } from "@heroui/button";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import NewSkuDialog, { SKUDialogRef } from "./modals/new-sku-dialog";
import CustomPagination from "@/components/ui/Pagination";
import useGetProducts from "../_hooks/use-get-products";
import { Package, PenBox, Trash2 } from "lucide-react";
import { TableActionMenuItem } from "@/types/table.type";
import AlertDialog, { AlertDialogRef } from "@/components/ui/AlertDialog";
import TableActionMenu from "@/components/customs/table-context-menu";
import { canEdit } from "@/utils/rbac.utils";
import { useAuth } from "../../_providers/authProvider";

const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "price",
    label: "Price",
  },
  {
    key: "quantity",
    label: "Quantity",
  },
  {
    key: "main_category",
    label: "Main Category",
  },
  {
    key: "sub_category",
    label: "SUb Category",
  },
  {
    key: "unit",
    label: "Unit",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "sku",
    label: "SKU",
  },
  {
    key: "edit",
    label: "Action",
  },
];

const initialItem = {
  id: "",
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
const ProductTable = () => {
  const { toast } = useToast();
  const { authSession } = useAuth();
  const permissions = authSession?.permissions;
  const [open, setOpen] = useState(false);

  const [isSkuDialogOpen, setIsSkuDialogOpen] = useState<boolean>(false);

  const [toDeleteId, setToDeleteId] = useState<string>("");
  const deleteAlertRef = useRef<AlertDialogRef>(null);

  const SKUModalRef = useRef<SKUDialogRef>(null);
  const { setSelectedId, setProductDetails, selectedProductId } = useProductStore();
  const { meta, productsData, getProductsData } = useGetProducts();
  const getDetails = async () => {
    const result = await getProductDetails(selectedProductId);
    if (result.data) setProductDetails(result.data);
  };

  const _canEdit = useMemo(() => {
    if (!permissions) return false;
    return canEdit(permissions, "product");
  }, [permissions]);

  const handleDeleteProduct = async () => {
    if (!toDeleteId) return;
    const result = await deleteProduct(toDeleteId);
    if (result.status === 200) {
      toast.success({
        title: "Success",
        message: "Product deleted successfully",
      });
    } else {
      toast.error({
        title: "Fail",
        message: `Failed to delete product: ${result.message}`,
      });
    }
  };

  const onPageChange = (value: number) => {
    const params = {
      page: value,
      limit: meta.limit,
      keyword: "",
    };
    getProductsData(params);
  };

  const onConfirmDelete = (id: string) => {
    setToDeleteId(id);
    deleteAlertRef.current?.handleOpen();
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };
  useEffect(() => {
    if (selectedProductId) {
      getDetails();
    } else {
      setProductDetails({} as ProductResponseType);
    }
  }, [selectedProductId]);

  useEffect(() => {
    getProductsData({
      page: 1,
      limit: 5,
    });
  }, []);

  const generateActionMenu = useCallback((item: ProductType): TableActionMenuItem[] => {
    return [
      { key: "edit", title: "Edit", onClick: () => handleEdit(item.id), icon: PenBox },
      { key: "delete", title: "Delete", onClick: () => onConfirmDelete(item.id), icon: Trash2 },
    ];
  }, []);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex-1 overflow-y-auto">
        <Table aria-label="Product list">
          <TableHeader>
            {columns.map((column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {productsData && productsData.length > 0 ? (
              productsData.map((item) => {
                const actionMenuItems = generateActionMenu(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>{mainCategory.find((c) => c.value === item.mainCategory.toString())?.label}</TableCell>
                    <TableCell>{subCategory.find((sc) => sc.value === item.subCategory.toString())?.label}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                      <Button
                        onPress={() => {
                          setSelectedId(item.id);
                          SKUModalRef.current?.handleOpen();
                        }}
                        className="size-8 border-0"
                        isIconOnly
                        variant="ghost"
                        title="sku"
                        disabled={!_canEdit}
                      >
                        <Package className="size-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <TableActionMenu menuItems={actionMenuItems} resource="product" />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
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
        initialPage={meta.page}
        onChange={onPageChange}
        className="flex justify-end"
      />
      <EditProduct open={open} setOpen={setOpen} />
      <NewSkuDialog ref={SKUModalRef} open={isSkuDialogOpen} setOpen={setIsSkuDialogOpen} />
      <AlertDialog ref={deleteAlertRef} title="Delete product" onConfirm={handleDeleteProduct} />
    </div>
  );
};

export default ProductTable;
