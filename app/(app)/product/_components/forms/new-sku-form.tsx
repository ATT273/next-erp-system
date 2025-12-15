import { Select, SelectItem } from "@heroui/select";
import { useEffect, useMemo, useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { IProductSku } from "@/types/product.type";
import { formatCurrency } from "@/utils/common.util";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useProductStore } from "../../_store/product-store";
import { ArrowBigDownDash } from "lucide-react";
import { mainCategory, subCategory } from "@/constants";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit: (data: IProductSku) => void;
}

const initialValue = {
  id: "",
  sku: "",
  size: "",
  qty: 0,
  price: 0,
  images: [],
};

const NewSkuForm = ({ open, setOpen, handleSubmit }: Props) => {
  const { setSelectedId, setProductDetails, selectedProductId, productDetails } = useProductStore();
  const [newSku, setNewSku] = useState<IProductSku>(initialValue);
  const [isValid, setIsValid] = useState<{
    size: boolean;
    qty: boolean;
    price: boolean;
    isSubmit: boolean;
  }>({
    size: true,
    qty: true,
    price: true,
    isSubmit: false,
  });

  const selectedSizes = useMemo(() => {
    return productDetails && productDetails.skus ? productDetails.skus.map((item) => item.sku.split(".")[2]) : [];
  }, [productDetails]);

  const sizes = useMemo(() => {
    return productDetails.sizes || [];
  }, [productDetails.sizes]);

  const validateForm = (data: IProductSku, isSubmit: boolean) => {
    return {
      size: data.size !== "",
      qty: data.qty > 0,
      price: data.price > 0,
      isSubmit: isSubmit,
    };
  };

  const handleAddSku = (data: IProductSku) => {
    setIsValid(validateForm(data, true));
    if (isValid.size && isValid.qty && isValid.price) {
      const _data = { ...data, images: [] };
      handleSubmit(_data);
      setNewSku(initialValue);
    }
  };

  const handleSelectSize = (size: string) => {
    const mainCategoryCode = mainCategory.find(
      (item) => item.value === (productDetails ? productDetails.mainCategory : "")
    )?.code;
    const subCategoryCode = subCategory.find(
      (item) => item.value === (productDetails ? productDetails.subCategory : "")
    )?.code;
    const _sku = mainCategoryCode && subCategoryCode ? `${mainCategoryCode}.${subCategoryCode}.${size}` : size;
    setNewSku({ ...newSku, size, sku: _sku });
  };

  useEffect(() => {
    setIsValid(validateForm(newSku, false));
  }, [newSku]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Select
          isRequired
          label="Size"
          size="sm"
          placeholder="Select size"
          disabledKeys={selectedSizes}
          selectedKeys={newSku.size ? [newSku.size] : []}
          errorMessage={isValid.size && isValid.isSubmit ? undefined : "Size is required"}
          isInvalid={!isValid.size && isValid.isSubmit}
          onChange={(e) => handleSelectSize(e.target.value)}
        >
          {sizes.map((item) => (
            <SelectItem aria-disabled="true" key={item}>
              {item}
            </SelectItem>
          ))}
        </Select>
        <Input
          isRequired
          label="Sell price"
          type="text"
          placeholder="Enter product sell price"
          size="sm"
          errorMessage={isValid.price && isValid.isSubmit ? undefined : "Price must be greater than 0"}
          isInvalid={!isValid.price && isValid.isSubmit}
          value={formatCurrency(newSku.price)}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            setNewSku({
              ...newSku,
              price: isNaN(Number(value)) ? 0 : Number(value),
            });
          }}
        />
        <Input
          isRequired
          label="Quantity"
          type="text"
          placeholder="Enter product quantity"
          size="sm"
          errorMessage={isValid.qty && isValid.isSubmit ? undefined : "Quantity must be greater than 0"}
          isInvalid={!isValid.qty && isValid.isSubmit}
          value={formatCurrency(newSku.qty)}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9]/g, "");
            setNewSku({
              ...newSku,
              qty: isNaN(Number(value)) ? 0 : Number(value),
            });
          }}
        />
      </div>
      <div className="flex gap-2 w-full justify-end">
        {/* <Button
          onPress={() => {
            setNewSku(initialValue);
            setOpen(false);
          }}
          className="grid place-items-center size-8 p-0 text-slate-900"
        >
          Cancel
        </Button> */}
        <Button
          onPress={() => handleAddSku(newSku)}
          className="grid place-items-center size-8 bg-emerald-500 text-white grow rounded-md"
        >
          <ArrowBigDownDash />
        </Button>
      </div>
    </div>
  );
};

export default NewSkuForm;
