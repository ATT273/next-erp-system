"use client";
import { SubmitHandler } from "react-hook-form";
import { updateProduct } from "../../actions";
import { ClientImage, IProductForm, IProductPayload, IProductSku, ProductResponseType } from "@/types/product.type";
import useToast from "../../../_hooks/use-toast";
import ProductForm from "../forms/product-form";
import { useProductStore } from "../../_store/product-store";
import { Drawer, useOverlayState } from "@heroui/react";
import { useUploadFiles } from "../../_hooks/use-upload-file";
import { useEffect } from "react";

const EditProduct = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const { toast } = useToast();
  const { setSelectedId, selectedProductId, setProductDetails } = useProductStore();
  const { uploading, uploadFiles } = useUploadFiles();
  const state = useOverlayState({ isOpen: open, onOpenChange: setOpen });

  const handleSubmit: SubmitHandler<IProductForm & { skuItems: IProductSku[]; files: ClientImage[] }> = async (values) => {
    const { skuItems, files, ...data } = values;
    const _data: IProductPayload = {
      ...data,
      mainCategory: values.mainCategory,
      subCategory: values.subCategory,
      importPrice: values.importPrice,
      description: values.description ?? "",
      sizes: values.sizes ?? [],
      images: [],
    };
    const currentImages = files.filter((f) => !f.file).map((f) => ({ name: f.name, url: f.url }));
    _data.images = [...currentImages];
    const needToUpload = files.filter((f) => f.file);
    if (needToUpload.length > 0) {
      const uploadResults = await uploadFiles(needToUpload);
      _data.images = [..._data.images, ...uploadResults];
    }
    const result = await updateProduct(selectedProductId, _data);
    if (result.status === 200) {
      toast.success({ title: "Success", message: "Product updated successfully" });
      setOpen(false);
    } else {
      toast.error({ title: "Fail", message: `Failed to update product: ${result.message}` });
    }
  };

  const handleClose = () => {
    setSelectedId("");
    setProductDetails({} as ProductResponseType);
    setOpen(false);
  };

  return (
    <Drawer state={state}>
      <Drawer.Backdrop isDismissable={false}>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.CloseTrigger onPress={handleClose} />
            <Drawer.Body>
              <ProductForm closeDrawer={handleClose} handleSubmit={handleSubmit} />
            </Drawer.Body>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
};

export default EditProduct;
