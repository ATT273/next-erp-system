import { useEffect, useMemo, useState, useImperativeHandle, ForwardedRef } from "react";
import { IProductImage, IProductImageResponse, IProductSku } from "@/types/product.type";
import { formatCurrency } from "@/utils/common.util";
import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import NewSkuForm from "../forms/new-sku-form";
import { ImagePlus, X } from "lucide-react";
import { useProductStore } from "../../_store/product-store";
import Image from "next/image";
import { updateProductSku } from "../../actions";
import useToast from "@/app/(app)/_hooks/use-toast";

export interface SKUDialogRef {
  handleOpen: () => void;
  handleClose: () => void;
}
interface SKUMdalProps {
  ref?: ForwardedRef<SKUDialogRef>;
  open: boolean;
  setOpen: (open: boolean) => void;
}
const NewSkuDialog = ({ ref, open, setOpen }: SKUMdalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setSelectedId, setProductDetails, selectedProductId, productDetails } = useProductStore();
  const [skuItems, setSKUItems] = useState<IProductSku[]>([]);
  const [showImages, setShowImages] = useState<string>("");
  const [productImages, setProductImages] = useState<IProductImageResponse[]>([]);
  const { toast } = useToast();

  const handleAddNewSku = (data: IProductSku) => {
    setSKUItems((prev) => [...prev, data]);
  };

  useEffect(() => {
    if (productDetails && productDetails.skus) setSKUItems(productDetails.skus);
    if (productDetails && productDetails.images) setProductImages(productDetails.images);
  }, [productDetails]);

  const handleRemoveSku = (index: number) => {
    const newSkuItems = skuItems.filter((_, i) => i !== index);
    setSKUItems(newSkuItems);
  };

  const handleSelectImage = (skuIndex: number, image: IProductImageResponse) => {
    const newSkus = [...skuItems];
    const selectedSKU = newSkus[skuIndex];
    if (selectedSKU) {
      const toAdd = !selectedSKU.images.some((img) => img?.productImageId === image.id);
      const _images = toAdd
        ? [...selectedSKU.images, { ...image, id: crypto.randomUUID(), productImageId: image.id }]
        : selectedSKU.images.filter((img) => img.productImageId !== image.id);
      selectedSKU.images = _images;
    }

    setSKUItems(newSkus);
  };

  const handleSubmit = async () => {
    const result = await updateProductSku(selectedProductId, skuItems);
    if (result.status === 200) {
      toast.success({
        title: "Success",
        message: "Product variants updated successfully",
      });
      handleClose();
    } else {
      toast.error({
        title: "Fail",
        message: `Failed to update product variants: ${result.message}`,
      });
    }
  };

  const handleOpen = () => {
    onOpen();
    setOpen(true);
  };
  const handleClose = () => {
    onClose();
    setOpen(false);
    setSelectedId("");
    setProductDetails({} as any);
    setSKUItems([]);
    setProductImages([]);
    setShowImages("");
  };

  useImperativeHandle(
    ref,
    () => ({
      handleOpen,
      handleClose,
    }),
    []
  );

  return (
    <Modal isOpen={isOpen} size="2xl" onClose={handleClose} isDismissable={false}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <p className="text-lg">Create new variant</p>
            </ModalHeader>
            <ModalBody>
              <NewSkuForm open={open} setOpen={setOpen} handleSubmit={handleAddNewSku} />
              <div>
                {skuItems.map((item, index) => (
                  <div key={item.sku} className="p-2 border border-gray-200 rounded-md mb-2">
                    <div className="flex gap-2 items-center justify-between w-full">
                      <p className="font-semibold">SKU: {item.sku}</p>
                      <div className="flex items-center gap-2">
                        <p>
                          Price: <span className="text-gray-500">{formatCurrency(item.price)} VND</span>
                        </p>
                        <p>
                          Quantity: <span className="text-gray-500">{formatCurrency(item.qty)}</span>
                        </p>
                        <Button
                          title="link images"
                          variant="light"
                          className="grid place-items-center hover:text-green-500 text-gray-500 data-[hover=true]:bg-transparent"
                          onPress={() => setShowImages(item.sku)}
                          isIconOnly
                        >
                          <ImagePlus className="size-4" />
                        </Button>
                        <Button
                          variant="light"
                          className="grid place-items-center hover:text-red-500 text-gray-500 data-[hover=true]:bg-transparent"
                          onPress={() => handleRemoveSku(index)}
                          isIconOnly
                        >
                          <X className="size-3" />
                        </Button>
                      </div>
                    </div>
                    {showImages === item.sku && (
                      <div className="flex gap-2 flex-wrap">
                        {productImages.map((image, idx) => {
                          const isSelected = item.images?.some((img) => img.productImageId === image.id);
                          return (
                            <div
                              key={idx}
                              className={`
                                relative w-[100px] h-[100px]  rounded-lg overflow-hidden border border-slate-200
                                ${isSelected ? "ring-2 ring-green-500" : "cursor-pointer hover:opacity-80"}
                              `}
                              onClick={() => handleSelectImage(index, image)}
                            >
                              <Image
                                key={index}
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
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={handleClose}>
                Cancel
              </Button>
              <Button className="bg-emerald-500" onPress={handleSubmit}>
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NewSkuDialog;
