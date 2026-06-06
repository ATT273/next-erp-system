import { Select, ListBox, Button, TextField, Label, Input } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { IProductSku } from "@/types/product.type";
import { formatCurrency } from "@/utils/common.util";
import { useProductStore } from "../../_store/product-store";
import { ArrowBigDownDash } from "lucide-react";
import { mainCategory, subCategory } from "@/constants";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleSubmit: (data: IProductSku) => void;
}

const initialValue = { id: "", sku: "", size: "", qty: 0, price: 0, images: [] };

const NewSkuForm = ({ open, setOpen, handleSubmit }: Props) => {
  const { setSelectedId, setProductDetails, selectedProductId, productDetails } = useProductStore();
  const [newSku, setNewSku] = useState<IProductSku>(initialValue);
  const [isValid, setIsValid] = useState({ size: true, qty: true, price: true, isSubmit: false });

  const selectedSizes = useMemo(() =>
    productDetails && productDetails.skus ? productDetails.skus.map((item) => item.sku.split(".")[2]) : [],
    [productDetails]);

  const sizes = useMemo(() => productDetails.sizes || [], [productDetails.sizes]);

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
    const mainCategoryCode = mainCategory.find((item) => item.value === (productDetails ? productDetails.mainCategory : ""))?.code;
    const subCategoryCode = subCategory.find((item) => item.value === (productDetails ? productDetails.subCategory : ""))?.code;
    const _sku = mainCategoryCode && subCategoryCode ? `${mainCategoryCode}.${subCategoryCode}.${size}` : size;
    setNewSku({ ...newSku, size, sku: _sku });
  };

  useEffect(() => { setIsValid(validateForm(newSku, false)); }, [newSku]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Select
          isRequired
          value={newSku.size}
          onChange={(v) => handleSelectSize(v)}
        >
          <Label>Size</Label>
          <Select.Trigger><Select.Value placeholder="Select size" /><Select.Indicator /></Select.Trigger>
          <Select.Popover>
            <ListBox disabledKeys={selectedSizes}>
              {sizes.map((item: string) => (
                <ListBox.Item key={item} id={item} textValue={item}>
                  {item}<ListBox.ItemIndicator />
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
        >
          <Label>Quantity</Label>
          <Input placeholder="Enter product quantity" />
        </TextField>
      </div>
      <div className="flex gap-2 w-full justify-end">
        <Button onPress={() => handleAddSku(newSku)} className="grid place-items-center size-8 bg-emerald-500 text-white grow rounded-md">
          <ArrowBigDownDash />
        </Button>
      </div>
    </div>
  );
};

export default NewSkuForm;
