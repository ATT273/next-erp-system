"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ProductResponseType, ProductType } from "@/types/product.type";
import Trash from "@/components/icons/trash";
import { mainCategory, subCategory } from "@/constants";
import { deleteProduct, getProductDetails } from "../actions";
import { formatCurrency } from "@/utils/common.util";
import useToast from "@/app/(app)/_hooks/use-toast";
import { useProductStore } from "../_store/product-store";
import EditProduct from "./drawer/product-detail-drawer";
import { Button, Table } from "@heroui/react";
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
  { key: "name", label: "NAME" },
  { key: "price", label: "Price" },
  { key: "quantity", label: "Quantity" },
  { key: "main_category", label: "Main Category" },
  { key: "sub_category", label: "Sub Category" },
  { key: "unit", label: "Unit" },
  { key: "description", label: "Description" },
  { key: "sku", label: "SKU" },
  { key: "edit", label: "Action" },
];

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
      toast.success({ title: "Success", message: "Product deleted successfully" });
    } else {
      toast.error({ title: "Fail", message: `Failed to delete product: ${result.message}` });
    }
  };

  const onPageChange = (value: number) => getProductsData({ page: value, limit: meta.limit, keyword: "" });
  const onConfirmDelete = (id: string) => { setToDeleteId(id); deleteAlertRef.current?.handleOpen(); };
  const handleEdit = (id: string) => { setSelectedId(id); setOpen(true); };

  useEffect(() => {
    if (selectedProductId) getDetails();
    else setProductDetails({} as ProductResponseType);
  }, [selectedProductId]);

  useEffect(() => { getProductsData({ page: 1, limit: 5 }); }, []);

  const generateActionMenu = useCallback((item: ProductType): TableActionMenuItem[] => [
    { key: "edit", title: "Edit", onClick: () => handleEdit(item.id), icon: PenBox },
    { key: "delete", title: "Delete", onClick: () => onConfirmDelete(item.id), icon: Trash2 },
  ], []);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="flex-1 overflow-y-auto">
        <Table aria-label="Product list">
          <Table.ScrollContainer>
            <Table.Content aria-label="Product list">
              <Table.Header>
                {columns.map((column) => (
                  <Table.Column key={column.key}>{column.label}</Table.Column>
                ))}
              </Table.Header>
              <Table.Body>
                {productsData && productsData.length > 0 ? (
                  productsData.map((item) => {
                    const actionMenuItems = generateActionMenu(item);
                    return (
                      <Table.Row key={item.id} id={item.id}>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>{formatCurrency(item.price)}</Table.Cell>
                        <Table.Cell>{item.qty}</Table.Cell>
                        <Table.Cell>{mainCategory.find((c) => c.value === item.mainCategory.toString())?.label}</Table.Cell>
                        <Table.Cell>{subCategory.find((sc) => sc.value === item.subCategory.toString())?.label}</Table.Cell>
                        <Table.Cell>{item.unit}</Table.Cell>
                        <Table.Cell>{item.description}</Table.Cell>
                        <Table.Cell>
                          <Button
                            onPress={() => { setSelectedId(item.id); SKUModalRef.current?.handleOpen(); }}
                            className="size-8 border-0"
                            isIconOnly
                            variant="ghost"
                            title="sku"
                            disabled={!_canEdit}
                          >
                            <Package className="size-4" />
                          </Button>
                        </Table.Cell>
                        <Table.Cell>
                          <TableActionMenu menuItems={actionMenuItems} resource="product" />
                        </Table.Cell>
                      </Table.Row>
                    );
                  })
                ) : (
                  <Table.Row id="empty">
                    <Table.Cell colSpan={columns.length} className="text-center">No products found</Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </div>
      <CustomPagination showControls total={meta.totalPages} initialPage={meta.page} onChange={onPageChange} className="flex justify-end" />
      <EditProduct open={open} setOpen={setOpen} />
      <NewSkuDialog ref={SKUModalRef} open={isSkuDialogOpen} setOpen={setIsSkuDialogOpen} />
      <AlertDialog ref={deleteAlertRef} title="Delete product" onConfirm={handleDeleteProduct} />
    </div>
  );
};

export default ProductTable;
