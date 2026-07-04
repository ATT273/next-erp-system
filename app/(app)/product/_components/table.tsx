"use client";
import { useCallback, useEffect, useRef } from "react";
import { ProductType } from "@/types/product.type";
import { mainCategory, subCategory } from "@/constants";
import { formatCurrency } from "@/utils/common.util";
import useToast from "@/app/(app)/_hooks/use-toast";
import { useProductStore } from "../_store/product-store";
import EditProductDialog, { EditProductRef } from "./modals/product-modal/ProductDetailDialog";
import { Button, Table } from "@heroui/react";
import NewSkuDialog, { SKUDialogRef } from "./modals/sku-modal/NewSkuDialog";
import CustomPagination from "@/components/customs/Pagination";
import useGetProducts from "../_hooks/use-get-products";
import { Package, PenBox, Trash2 } from "lucide-react";
import { TableActionMenuItem } from "@/types/table.type";
import AlertDialog, { AlertDialogRef } from "@/components/customs/AlertDialog";
import TableContextMenu from "@/components/customs/TableContextMenu";

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
  const editProductRef = useRef<EditProductRef>(null);
  const deleteAlertRef = useRef<AlertDialogRef>(null);
  const SKUModalRef = useRef<SKUDialogRef>(null);
  const { setSelectedId, setProductDetails } = useProductStore();
  const { meta, productsData, getProductsData } = useGetProducts();

  const handleDeleteProduct = async () => {};

  const onPageChange = (value: number) => getProductsData({ page: value, limit: meta.limit, keyword: "" });

  const onConfirmDelete = (id: string) => {
    setSelectedId(id);
    deleteAlertRef.current?.handleOpen();
  };

  const handleEdit = (id: string) => {
    setSelectedId(id);
    editProductRef.current?.handleOpen();
  };

  useEffect(() => {
    getProductsData({ page: 1, limit: 5 });
  }, []);

  const generateActionMenu = useCallback(
    (item: ProductType): TableActionMenuItem[] => [
      { key: "edit", title: "Edit", onClick: () => handleEdit(item.id), icon: PenBox },
      { key: "delete", title: "Delete", onClick: () => onConfirmDelete(item.id), icon: Trash2 },
    ],
    [],
  );

  const handleOpenSkusDialog = (id: string) => {
    setSelectedId(id);
    const selectedProduct = productsData.find((p) => p.id === id);
    if (selectedProduct) {
      setProductDetails(selectedProduct);
    }
    SKUModalRef.current?.handleOpen();
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex-1 overflow-y-auto">
        <Table aria-label="Product list">
          <Table.ScrollContainer>
            <Table.Content aria-label="Product list" selectionMode="none">
              <Table.Header>
                {columns.map((column) => (
                  <Table.Column key={column.key} isRowHeader={column.key === "name"}>
                    {column.label}
                  </Table.Column>
                ))}
              </Table.Header>
              <Table.Body items={productsData ?? []}>
                {(item) => (
                  <Table.Row id={item.id}>
                    <Table.Cell>{item.name}</Table.Cell>
                    <Table.Cell>{formatCurrency(item.price)}</Table.Cell>
                    <Table.Cell>{item.qty}</Table.Cell>
                    <Table.Cell>{mainCategory.find((c) => c.value === item.mainCategory.toString())?.label}</Table.Cell>
                    <Table.Cell>{subCategory.find((sc) => sc.value === item.subCategory.toString())?.label}</Table.Cell>
                    <Table.Cell>{item.unit}</Table.Cell>
                    <Table.Cell>{item.description}</Table.Cell>
                    <Table.Cell>
                      <Button
                        onPress={() => handleOpenSkusDialog(item.id)}
                        className="border-0 size-8"
                        isIconOnly
                        variant="ghost"
                      >
                        <Package className="size-4" />
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <TableContextMenu menuItems={generateActionMenu(item)} resource="product" />
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
        initialPage={meta.page}
        onChange={onPageChange}
        className="flex justify-end"
      />
      <EditProductDialog ref={editProductRef} />
      <NewSkuDialog ref={SKUModalRef} open={false} setOpen={() => {}} />
      <AlertDialog ref={deleteAlertRef} title="Delete product" onConfirm={handleDeleteProduct} />
    </div>
  );
};

export default ProductTable;
