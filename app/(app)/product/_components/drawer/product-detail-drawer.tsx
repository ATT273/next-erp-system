"use client";
import { SubmitHandler } from "react-hook-form";
import { updateProduct } from "../../actions";
import { ClientImage, IProductForm, IProductPayload, IProductSku, ProductResponseType } from "@/types/product.type";
import useToast from "../../../_hooks/use-toast";
import ProductForm from "../forms/product-form";
import { useProductStore } from "../../_store/product-store";
import { Drawer, DrawerContent } from "@heroui/drawer";
import { useUploadFiles } from "../../_hooks/use-upload-file";

const EditProduct = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const { toast } = useToast();
  const { setSelectedId, selectedProductId, setProductDetails } = useProductStore();
  const { uploading, uploadFiles } = useUploadFiles();

  const handleSubmit: SubmitHandler<IProductForm & { skuItems: IProductSku[]; files: ClientImage[] }> = async (
    values: IProductForm & { skuItems: IProductSku[]; files: ClientImage[] }
  ) => {
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
      toast.success({
        title: "Success",
        message: "Product created successfully",
      });
      setOpen(false);
    } else {
      toast.error({
        title: "Fail",
        message: `Failed to create SKU: ${result.message}`,
      });
    }
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedId("");
      setProductDetails({} as ProductResponseType);
    }
    setOpen(open);
  };

  return (
    <div>
      <Drawer isOpen={open} onOpenChange={onOpenChange} size="xl" isDismissable={false}>
        <DrawerContent className="">
          {(onClose) => <ProductForm closeDrawer={setOpen} handleSubmit={handleSubmit} />}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default EditProduct;
