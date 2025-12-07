"use client";
import { useFormContext, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ClientImage, IProductForm, IProductSku, ProductType } from "@/types/product.type";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { formInfoSchema } from "../../_types/inventory.schema";
import { formatCurrency } from "@/utils/common.util";
import { useInventoryStore } from "../../_store/inventory-store";

interface Props {
  products: ProductType[];
}

const CHANGE_TYPES = [
  { value: "SALES", label: "Sale" },
  { value: "IMPORT", label: "Import" },
  { value: "ADJUSTMENT", label: "Adjustment" },
  { value: "RETURN", label: "Return" },
];
const NewInventoryForm = ({ products }: Props) => {
  const formInfo = useFormContext<z.infer<typeof formInfoSchema>>();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const inventoryDetails = useInventoryStore((store) => store.inventoryDetails);
  // form watchers
  const watchedSkuId = formInfo.watch("skuId");
  const watchedQuantityChange = formInfo.watch("qtyChange");

  const productSkus = useMemo(() => {
    return products.find((item) => item.id === selectedProductId)?.skus || [];
  }, [selectedProductId]);
  const selectedSku = useMemo(() => {
    return productSkus.find((item) => item.id === watchedSkuId) || null;
  }, [watchedSkuId]);

  useEffect(() => {
    if (inventoryDetails && inventoryDetails.productId) {
      setSelectedProductId(inventoryDetails.productId);
    }
  }, [inventoryDetails]);
  const [isValid, setIsValid] = useState<{
    skuId: boolean;
    changeType: boolean;
    qtyChange: boolean;
    isSubmit: boolean;
  }>({
    skuId: true,
    changeType: true,
    qtyChange: false,
    isSubmit: false,
  });
  return (
    <>
      <Controller
        name="changeType"
        control={formInfo.control}
        render={({ field }) => (
          <Select
            isRequired
            label="Change Type"
            size="sm"
            placeholder="Select Change Type"
            selectedKeys={field.value ? [field.value] : []}
            errorMessage={isValid.changeType && isValid.isSubmit ? undefined : "Change Type is required"}
            isInvalid={!isValid.changeType && isValid.isSubmit}
            onChange={field.onChange}
          >
            {CHANGE_TYPES.map((item) => (
              <SelectItem aria-disabled="true" key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </Select>
        )}
      />
      <Select
        isRequired
        label="Product"
        size="sm"
        placeholder="Select product"
        selectedKeys={selectedProductId ? [selectedProductId] : []}
        errorMessage={isValid.skuId && isValid.isSubmit ? undefined : "Product is required"}
        isInvalid={!isValid.skuId && isValid.isSubmit}
        onChange={(e) => setSelectedProductId(e.target.value)}
      >
        {products.map((item) => (
          <SelectItem aria-disabled="true" key={item.id}>
            {item.name}
          </SelectItem>
        ))}
      </Select>
      <Controller
        name="skuId"
        control={formInfo.control}
        render={({ field }) => (
          <Select
            isRequired
            label="SKU"
            size="sm"
            placeholder="Select SKU"
            selectedKeys={field.value ? [field.value] : []}
            errorMessage={isValid.skuId && isValid.isSubmit ? undefined : "SKU is required"}
            isInvalid={!isValid.skuId && isValid.isSubmit}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
          >
            {productSkus.length > 0 ? (
              productSkus.map((item) => (
                <SelectItem aria-disabled="true" key={item.id}>
                  {item.sku}
                </SelectItem>
              ))
            ) : (
              <SelectItem aria-disabled="true" key="no-sku">
                No SKU available
              </SelectItem>
            )}
          </Select>
        )}
      />
      <Controller
        name="note"
        control={formInfo.control}
        render={({ field }) => (
          <Input
            label="Note"
            type="text"
            placeholder="Enter product note"
            size="sm"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <div className="flex w-full gap-2 border-b-2 border-slate-400 pb-2">
        <div className="flex justify-end items-center flex-1 min-w-[250px] gap-2">
          <p className="text-sm">Price:</p>
          {selectedSku && <p className="font-medium">{formatCurrency(selectedSku.price)}đ x </p>}
        </div>
        <Controller
          name="qtyChange"
          control={formInfo.control}
          render={({ field }) => (
            <Input
              isRequired
              label="Quantity"
              type="text"
              placeholder="Enter product quantity"
              size="sm"
              errorMessage={isValid.qtyChange && isValid.isSubmit ? undefined : "Quantity must be greater than 0"}
              isInvalid={!isValid.qtyChange && isValid.isSubmit}
              value={field.value.toString()}
              // className="w-[100px]"
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (!value) return field.onChange(0);
                field.onChange(Number(value));
              }}
            />
          )}
        />
      </div>
      <div className="flex justify-end items-center gap-4">
        <p className="text-sm">Total Price:</p>
        <p className="font-medium text-lg">
          {selectedSku ? formatCurrency(selectedSku.price * watchedQuantityChange) : formatCurrency(0)}đ
        </p>
      </div>
    </>
  );
};

export default NewInventoryForm;
