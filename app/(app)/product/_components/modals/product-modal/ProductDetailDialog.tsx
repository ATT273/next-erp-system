"use client";
import { SubmitHandler } from "react-hook-form";
import { updateProduct } from "../../../actions";
import { ClientImage, IProductForm, IProductPayload, IProductSku, ProductDataResponseType } from "@/types/product.type";
import useToast from "../../../../_hooks/use-toast";
import ProductForm from "../../forms/ProductForm";
import { useProductStore } from "../../../_store/product-store";
import { Modal, useOverlayState } from "@heroui/react";
import { useUploadFiles } from "../../../_hooks/use-upload-file";
import { ForwardedRef, useImperativeHandle } from "react";
import useGetProductDetails from "../../../_hooks/use-get-product-details";
import Footer from "./ProductDialogFooter";
import ProductFormSkeleton from "../../forms/ProductFormSkeleton";
import { useQueryClient } from "@tanstack/react-query";
import { GET_PRODUCTS_QUERY_KEY } from "../../../_hooks/use-get-products";
import { IProductPayloadRequest } from "@/types/requests/product.request";

export interface EditProductRef {
  handleOpen: () => void;
  handleClose: () => void;
}

interface EditProductProps {
  ref?: ForwardedRef<EditProductRef>;
}

const EditProductDialog = ({ ref }: EditProductProps) => {
  const { toast } = useToast();
  const { setSelectedId, selectedProductId, setProductDetails } = useProductStore();
  const { uploadFiles } = useUploadFiles();
  const state = useOverlayState();
  const { data, isFetching } = useGetProductDetails(selectedProductId);
  const queryClient = useQueryClient();

  const handleSubmit: SubmitHandler<IProductForm & { skuItems: IProductSku[]; files: ClientImage[] }> = async (
    values,
  ) => {
    const { skuItems, files, ...data } = values;
    const _data: IProductPayloadRequest = {
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
      queryClient.invalidateQueries({ queryKey: [GET_PRODUCTS_QUERY_KEY] });
      handleClose();
    } else {
      toast.error({ title: "Fail", message: `Failed to update product: ${result.message}` });
    }
  };

  const handleClose = () => {
    setSelectedId("");
    setProductDetails({} as ProductDataResponseType);
    state.close();
  };

  useImperativeHandle(
    ref,
    () => ({
      handleOpen: () => state.open(),
      handleClose,
    }),
    [],
  );

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="cover">
          <Modal.Dialog>
            <Modal.CloseTrigger onPress={handleClose} />
            <Modal.Header>
              <Modal.Heading>Edit product</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              {isFetching ? (
                <ProductFormSkeleton />
              ) : (
                <ProductForm closeDrawer={handleClose} handleSubmit={handleSubmit} productDetails={data} />
              )}
            </Modal.Body>
            <Modal.Footer>
              <Footer closeDrawer={handleClose} />
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default EditProductDialog;
