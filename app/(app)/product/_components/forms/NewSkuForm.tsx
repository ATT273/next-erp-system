import { Select, ListBox, Button, TextField, Label, Input } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { IProductSku } from "@/types/product.type";
import { formatCurrency } from "@/utils/common.util";
import { ArrowBigDownDash } from "lucide-react";
import { mainCategory, subCategory } from "@/constants";
import LoadingSpinner from "@/components/customs/LoadingSpinner";
import { ProductType } from "@/types/responses/product.response";
import { getMainCategoryCode, getSubCategoryCode } from "@/utils/category.util";

interface Props {
  isFetchingDetails: boolean;
  productDetails: ProductType | null | undefined;
  existingSizes: string[];
  handleSubmit: (data: IProductSku) => void;
}

const initialValue = { id: "", sku: "", size: "", qty: 0, price: 0, images: [] };

const NewSkuForm = ({ isFetchingDetails, productDetails, existingSizes, handleSubmit }: Props) => {
  const [newSku, setNewSku] = useState<IProductSku>(initialValue);
  const [isValid, setIsValid] = useState({ size: true, qty: true, price: true, isSubmit: false });

  const selectedSizes = useMemo(
    () => (productDetails && productDetails.skus ? productDetails.skus.map((item) => item.sku.split(".")[2]) : []),
    [productDetails],
  );

  const sizes = useMemo(() => productDetails?.sizes || [], [productDetails?.sizes]);

  const validateForm = (data: IProductSku, isSubmit: boolean) => ({
    size: data.size !== "",
    qty: data.qty > 0,
    price: data.price > 0,
    isSubmit,
  });

  const handleAddSku = (data: IProductSku) => {
    setIsValid(validateForm(data, true));
    if (isValid.size && isValid.qty && isValid.price) {
      handleSubmit({ ...data, images: [] });
      setNewSku(initialValue);
    }
  };

  const handleSelectSize = (size: string) => {
    const mainCategory = productDetails ? productDetails.mainCategory.toString() : "";
    const subCategory = productDetails ? productDetails.subCategory.toString() : "";

    const mainCategoryCode = getMainCategoryCode(mainCategory);
    const subCategoryCode = getSubCategoryCode(subCategory);

    const _sku = mainCategoryCode && subCategoryCode ? `${mainCategoryCode}.${subCategoryCode}.${size}` : size;
    setNewSku({ ...newSku, size, sku: _sku });
  };

  useEffect(() => {
    setIsValid(validateForm(newSku, false));
  }, [newSku]);

  if (isFetchingDetails) {
    return <LoadingSpinner />;
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Select
          isRequired
          value={newSku.size}
          onChange={(v) => handleSelectSize(v as string)}
          placeholder="Select size"
          className="w-[150px]"
        >
          <Label>Size</Label>
          <Select.Trigger className="w-[150px]">
            <Select.Value aria-placeholder="Select product size" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox disabledKeys={existingSizes}>
              {sizes.map((item: string) => (
                <ListBox.Item key={item} id={item} textValue={item} isDisabled={existingSizes.includes(item)}>
                  {item}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
        <TextField
          isRequired
          type="text"
          isInvalid={!isValid.price && isValid.isSubmit}
          value={formatCurrency(newSku.price)}
          onChange={(v) => {
            const value = v.replace(/[^0-9]/g, "");
            setNewSku({ ...newSku, price: isNaN(Number(value)) ? 0 : Number(value) });
          }}
          className="w-[150px]"
        >
          <Label>Sell price</Label>
          <Input placeholder="Enter product sell price" />
        </TextField>
        <TextField
          isRequired
          type="text"
          isInvalid={!isValid.qty && isValid.isSubmit}
          value={formatCurrency(newSku.qty)}
          onChange={(v) => {
            const value = v.replace(/[^0-9]/g, "");
            setNewSku({ ...newSku, qty: isNaN(Number(value)) ? 0 : Number(value) });
          }}
          className="w-[150px]"
        >
          <Label>Quantity</Label>
          <Input placeholder="Enter product quantity" />
        </TextField>
      </div>
      <div className="flex justify-end w-full gap-2">
        <Button
          onPress={() => handleAddSku(newSku)}
          className="grid text-white rounded-md place-items-center size-8 bg-emerald-500 grow"
        >
          <ArrowBigDownDash />
        </Button>
      </div>
    </div>
  );
};

export default NewSkuForm;
