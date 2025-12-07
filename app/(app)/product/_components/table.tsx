"use client";
import { useEffect, useRef, useState } from "react";
import { ProductType } from "@/types/product.type";
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
    label: "",
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
  const [open, setOpen] = useState(false);
  const [deletedProduct, setDeletedProduct] = useState<string>("");
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [isSkuDialogOpen, setIsSkuDialogOpen] = useState<boolean>(false);

  const SKUModalRef = useRef<SKUDialogRef>(null);
  const { setSelectedId, setProductDetails, selectedProductId } = useProductStore();
  const { meta, productsData, getProductsData } = useGetProducts();
  const getDetails = async () => {
    const result = await getProductDetails(selectedProductId);
    if (result.data) setProductDetails(result.data);
  };

  const handleDeleteProduct = async (id: string) => {
    const result = await deleteProduct(id);
    if (result.status === 200) {
      setOpenDeleteConfirm(false);
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
    // setMeta((prev) => ({ ...prev, page: value }));
    const params = {
      page: value,
      limit: meta.limit,
      keyword: "",
    };
    getProductsData(params);
  };
  useEffect(() => {
    if (selectedProductId) {
      getDetails();
    } else {
      setProductDetails({} as ProductType);
    }
  }, [selectedProductId]);

  useEffect(() => {
    getProductsData({
      page: 1,
      limit: 5,
    });
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
              productsData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {item.name} - {item.id}
                  </TableCell>
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
                      className="size-8"
                      variant="ghost"
                    >
                      Skus
                    </Button>
                  </TableCell>
                  <TableCell>
                    {!open && (
                      <Popover key={"context-menu"} placement="bottom">
                        <PopoverTrigger>
                          <Button isIconOnly variant="light">
                            <ThreeDots className="text-slate-900 size-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="rounded-md p-0 overflow-x-hidden">
                          <ul>
                            <li>
                              <Button
                                variant="light"
                                className="w-full rounded-none"
                                onPress={() => {
                                  setOpen(true);
                                  setSelectedId(item.id);
                                }}
                                startContent={<EditIcon className="text-teal-500 size-4" />}
                              >
                                <p className="text-slate-900 ml-2">Edit</p>
                              </Button>
                            </li>
                            <li>
                              <Button
                                variant="light"
                                className="w-full rounded-none"
                                onPress={() => {
                                  setOpenDeleteConfirm(true);
                                  setDeletedProduct(item.id);
                                }}
                                startContent={<Trash className="text-red-500 size-4" />}
                              >
                                <p className="text-slate-900 ml-2">Delete</p>
                              </Button>
                            </li>
                          </ul>
                        </PopoverContent>
                      </Popover>
                    )}
                  </TableCell>
                </TableRow>
              ))
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
      <Modal isOpen={openDeleteConfirm} onOpenChange={setOpenDeleteConfirm}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">"Confirm delete"</ModalHeader>
              <ModalBody>
                <p className="text-slate-900 mb-2">Are you sure you want to delete this product?</p>
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-2 w-full justify-end">
                  <Button
                    onPress={() => setOpenDeleteConfirm(false)}
                    className="grid place-items-center size-8 p-0 text-slate-900"
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => handleDeleteProduct(deletedProduct)}
                    className="grid place-items-center size-8 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProductTable;
