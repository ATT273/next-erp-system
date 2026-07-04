"use client";
import { Button, Modal, useOverlayState } from "@heroui/react";
import { SubmitHandler } from "react-hook-form";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../../actions";
import { ClientImage, IProductForm, IProductPayload, IProductSku } from "@/types/product.type";
import useToast from "../../../../_hooks/use-toast";
import ProductForm from "../../forms/ProductForm";
import { useUploadFiles } from "../../../_hooks/use-upload-file";
import { canEdit } from "@/utils/rbac.utils";
import { useAuth } from "../../../../_providers/authProvider";
import Footer from "./ProductDialogFooter";
import { GET_PRODUCTS_QUERY_KEY } from "../../../_hooks/use-get-products";
import { IProductFormValues } from "../../../_types/product.schema";

const NewProduct = () => {
  const state = useOverlayState();

  const { authSession } = useAuth();
  const _canEdit = useMemo(() => {
    if (!authSession?.permissions) return false;
    return canEdit(authSession.permissions, "product");
  }, [authSession?.permissions]);

  const { toast } = useToast();

  const { uploadFiles } = useUploadFiles();

  const queryClient = useQueryClient();

  const handleSubmit: SubmitHandler<IProductFormValues & { skuItems: IProductSku[]; files: ClientImage[] }> = async (
    values,
  ) => {
    const { skuItems, files, ...data } = values;
    const productSkus = skuItems.map((item) => item.sku);
    const _data: IProductPayload = {
      ...data,
      skus: productSkus,
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
      queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS_QUERY_KEY] });
      state.close();
    } else {
      toast.error({ title: "Fail", message: `Failed to create product: ${result.message}` });
    }
  };

  return (
    <div>
      <Modal state={state}>
        <Modal.Backdrop isDismissable={false}>
          <Modal.Container size="lg">
            <Modal.Dialog className="max-w-5xl max-h-full">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Add new product</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <ProductForm closeDrawer={() => state.close()} handleSubmit={handleSubmit} />
              </Modal.Body>
              <Modal.Footer>
                <Footer closeDrawer={() => state.close()} />
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
      <Button
        variant="outline"
        onPress={() => state.open()}
        isDisabled={!_canEdit}
        className="font-semibold hover:bg-emerald-500 hover:text-white"
      >
        Add new product
      </Button>
    </div>
  );
};

export default NewProduct;
