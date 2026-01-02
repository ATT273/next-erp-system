"use client";
import { Button } from "@heroui/button";
import { Drawer, DrawerContent } from "@heroui/drawer";
import { SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { PERMISSION_VALUE } from "@/constants";
import { createProduct, createProductSku } from "../../actions";
import { ClientImage, IProductForm, IProductPayload, IProductSku } from "@/types/product.type";
import useToast from "../../../_hooks/use-toast";
import ProductForm from "../forms/product-form";
import { useUploadFiles } from "../../_hooks/use-upload-file";

const NewProduct = () => {
  const [open, setOpen] = useState(false);
  const [permissions, setPermissions] = useState({
    access: false,
    edit: false,
    delete: false,
  });
  const { toast } = useToast();
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

    if (files.length > 0) {
      const uploadResults = await uploadFiles(files);
      if (uploadResults.length > 0) {
        _data.images = uploadResults;
      }
    }
    const result = await createProduct(_data);
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
    setOpen(open);
  };
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const user = JSON.parse(localUser);
      const _permissions = {
        access: !!(user.permissions & PERMISSION_VALUE.ACCESS),
        edit: !!(user.permissions & PERMISSION_VALUE.EDIT),
        delete: !!(user.permissions & PERMISSION_VALUE.DELETE),
      };
      setPermissions(_permissions);
    }
  }, []);

  return (
    <div className="">
      <Drawer isOpen={open} onOpenChange={onOpenChange} size="xl" isDismissable={false}>
        <DrawerContent>
          <ProductForm closeDrawer={setOpen} handleSubmit={handleSubmit} />
        </DrawerContent>
      </Drawer>
      <Button onPress={() => setOpen(true)} disabled={!permissions.edit}>
        Add new product
      </Button>
    </div>
  );
};

export default NewProduct;
