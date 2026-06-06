"use client";
import { Button, Drawer, useOverlayState } from "@heroui/react";
import { SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import { PERMISSION_VALUE } from "@/constants";
import { createProduct } from "../../actions";
import { ClientImage, IProductForm, IProductPayload, IProductSku } from "@/types/product.type";
import useToast from "../../../_hooks/use-toast";
import ProductForm from "../forms/product-form";
import { useUploadFiles } from "../../_hooks/use-upload-file";

const NewProduct = () => {
  const state = useOverlayState();
  const [permissions, setPermissions] = useState({ access: false, edit: false, delete: false });
  const { toast } = useToast();
  const { uploading, uploadFiles } = useUploadFiles();

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
    if (files.length > 0) {
      const uploadResults = await uploadFiles(files);
      if (uploadResults.length > 0) _data.images = uploadResults;
    }
    const result = await createProduct(_data);
    if (result.status === 200) {
      toast.success({ title: "Success", message: "Product created successfully" });
      state.close();
    } else {
      toast.error({ title: "Fail", message: `Failed to create SKU: ${result.message}` });
    }
  };

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const user = JSON.parse(localUser);
      setPermissions({
        access: !!(user.permissions & PERMISSION_VALUE.ACCESS),
        edit: !!(user.permissions & PERMISSION_VALUE.EDIT),
        delete: !!(user.permissions & PERMISSION_VALUE.DELETE),
      });
    }
  }, []);

  return (
    <div>
      <Drawer state={state}>
        <Drawer.Backdrop isDismissable={false}>
          <Drawer.Content placement="right">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Body>
                <ProductForm closeDrawer={() => state.close()} handleSubmit={handleSubmit} />
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
      <Button onPress={() => state.open()} disabled={!permissions.edit}>
        Add new product
      </Button>
    </div>
  );
};

export default NewProduct;
