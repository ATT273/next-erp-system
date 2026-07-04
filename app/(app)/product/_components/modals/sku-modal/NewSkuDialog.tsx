import { useEffect, useImperativeHandle, ForwardedRef } from "react";
import { IProductImageResponse, IProductSku } from "@/types/product.type";
import { formatCurrency } from "@/utils/common.util";
import { Button, Modal, useOverlayState } from "@heroui/react";
import NewSkuForm from "../../forms/NewSkuForm";
import { ImagePlus, X } from "lucide-react";
import { useProductStore } from "../../../_store/product-store";
import Image from "next/image";
import { updateProductSku } from "../../../actions";
import useToast from "@/app/(app)/_hooks/use-toast";
import { useState } from "react";
import useGetProductDetails from "../../../_hooks/use-get-product-details";
import { Spinner } from "@heroui/react";

export interface SKUDialogRef {
  handleOpen: () => void;
  handleClose: () => void;
}
interface SKUModalProps {
  ref?: ForwardedRef<SKUDialogRef>;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const NewSkuDialog = ({ ref, open, setOpen }: SKUModalProps) => {
  const state = useOverlayState();
  const { setSelectedId, setProductDetails, selectedProductId, productDetails } = useProductStore();
  const { data, isFetching, error } = useGetProductDetails(selectedProductId);
  const [skuItems, setSKUItems] = useState<IProductSku[]>([]);
  const [showImages, setShowImages] = useState<string>("");
  const [productImages, setProductImages] = useState<IProductImageResponse[]>([]);
  const { toast } = useToast();

  const existingSizes = skuItems.map((sku) => sku.sku.split(".")[2]);
  const handleAddNewSku = (data: IProductSku) => setSKUItems((prev) => [...prev, data]);

  useEffect(() => {
    if (productDetails && productDetails.skus) setSKUItems(productDetails.skus);
    if (productDetails && productDetails.images) setProductImages(productDetails.images);
  }, [productDetails]);

  const handleRemoveSku = (index: number) => setSKUItems(skuItems.filter((_, i) => i !== index));

  const handleSelectImage = (skuIndex: number, image: IProductImageResponse) => {
    const newSkus = [...skuItems];
    const selectedSKU = newSkus[skuIndex];
    if (selectedSKU) {
      const toAdd = !selectedSKU.images.some((img) => img?.productImageId === image.id);
      selectedSKU.images = toAdd
        ? [...selectedSKU.images, { ...image, id: crypto.randomUUID(), productImageId: image.id }]
        : selectedSKU.images.filter((img) => img.productImageId !== image.id);
    }
    setSKUItems(newSkus);
  };

  const handleSubmit = async () => {
    const result = await updateProductSku(selectedProductId, skuItems);
    if (result.status === 200) {
      toast.success({ title: "Success", message: "Product variants updated successfully" });
      handleClose();
    } else {
      toast.error({ title: "Fail", message: `Failed to update product variants: ${result.message}` });
    }
  };

  const handleOpen = () => {
    state.open();
    setOpen(true);
  };
  const handleClose = () => {
    state.close();
    setOpen(false);
    setSelectedId("");
    setProductDetails({} as any);
    setSKUItems([]);
    setProductImages([]);
    setShowImages("");
  };

  useImperativeHandle(ref, () => ({ handleOpen, handleClose }), []);

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="lg">
          <Modal.Dialog>
            <Modal.CloseTrigger onPress={handleClose} />
            <Modal.Header>
              <Modal.Heading>Create new variant</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <NewSkuForm
                  handleSubmit={handleAddNewSku}
                  isFetchingDetails={isFetching}
                  productDetails={data}
                  existingSizes={existingSizes}
                />
                <div>
                  {skuItems.map((item, index) => (
                    <div key={item.sku} className="p-2 mb-2 border border-gray-200 rounded-md">
                      <div className="flex items-center justify-between w-full gap-2">
                        <p className="font-semibold">SKU: {item.sku}</p>
                        <div className="flex items-center gap-2">
                          <p>
                            Price: <span className="text-gray-500">{formatCurrency(item.price)} VND</span>
                          </p>
                          <p>
                            Quantity: <span className="text-gray-500">{formatCurrency(item.qty)}</span>
                          </p>
                          <Button
                            aria-label="link images"
                            variant="ghost"
                            className="grid text-gray-500 place-items-center hover:text-green-500"
                            onPress={() => setShowImages(item.sku)}
                            isIconOnly
                          >
                            <ImagePlus className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            className="grid text-gray-500 place-items-center hover:text-red-500"
                            onPress={() => handleRemoveSku(index)}
                            isIconOnly
                          >
                            <X className="size-3" />
                          </Button>
                        </div>
                      </div>
                      {showImages === item.sku && (
                        <div className="flex flex-wrap gap-2">
                          {productImages.map((image, idx) => {
                            const isSelected = item.images?.some((img) => img.productImageId === image.id);
                            return (
                              <div
                                key={idx}
                                className={`relative w-[100px] h-[100px] rounded-lg overflow-hidden border border-slate-200 ${isSelected ? "ring-2 ring-green-500" : "cursor-pointer hover:opacity-80"}`}
                                onClick={() => handleSelectImage(index, image)}
                              >
                                <Image
                                  alt={image.name || "product image"}
                                  src={image.url}
                                  width={300}
                                  height={300}
                                  className="object-cover w-[100px] h-[100px]"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline" onPress={handleClose}>
                Cancel
              </Button>
              <Button className="bg-emerald-500" onPress={handleSubmit}>
                Save
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default NewSkuDialog;
