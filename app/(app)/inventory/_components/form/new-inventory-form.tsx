"use client";
import { useFormContext, Controller } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { ProductType } from "@/types/product.type";
import { TextField, Label, Input, Select, ListBox } from "@heroui/react";
import { formInventorySchema } from "../../_types/inventory.schema";
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
  const formInfo = useFormContext<z.infer<typeof formInventorySchema>>();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const inventoryDetails = useInventoryStore((store) => store.inventoryDetails);
  const watchedSkuId = formInfo.watch("skuId");
  const watchedQuantityChange = formInfo.watch("qtyChange");

  const productSkus = useMemo(
    () => products.find((item) => item.id === selectedProductId)?.skus || [],
    [selectedProductId],
  );
  const selectedSku = useMemo(() => productSkus.find((item) => item.id === watchedSkuId) || null, [watchedSkuId]);

  useEffect(() => {
    if (inventoryDetails && inventoryDetails.productId) setSelectedProductId(inventoryDetails.productId);
  }, [inventoryDetails]);

  return (
    <div className="flex flex-col w-full gap-4">
      <Controller
        name="changeType"
        control={formInfo.control}
        render={({ field }) => (
          <Select
            isRequired
            value={field.value}
            name={field.name}
            onChange={field.onChange}
            placeholder="Select Change Type"
          >
            <Label>Change Type</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {CHANGE_TYPES.map((item) => (
                  <ListBox.Item key={item.value} id={item.value} textValue={item.label}>
                    {item.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      />
      <Select
        isRequired
        value={selectedProductId ?? ""}
        onChange={(v) => setSelectedProductId(v as string)}
        placeholder="Select product"
      >
        <Label>Product</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {products.map((item) => (
              <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                {item.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      <Controller
        name="skuId"
        control={formInfo.control}
        render={({ field }) => (
          <Select isRequired value={field.value} name={field.name} onChange={field.onChange} placeholder="Select SKU">
            <Label>SKU</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {productSkus.length > 0 ? (
                  productSkus.map((item) => (
                    <ListBox.Item key={item.id} id={item.id} textValue={item.sku}>
                      {item.sku}
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))
                ) : (
                  <ListBox.Item key="no-sku" id="no-sku" textValue="No SKU available">
                    No SKU available
                  </ListBox.Item>
                )}
              </ListBox>
            </Select.Popover>
          </Select>
        )}
      />
      <Controller
        name="note"
        control={formInfo.control}
        render={({ field }) => (
          <TextField type="text" className="w-full" value={field.value} onChange={field.onChange}>
            <Label>Note</Label>
            <Input placeholder="Enter product note" />
          </TextField>
        )}
      />
      <div className="items-center w-full gap-2 pb-2 border-b-2 border-slate-400">
        <div className="grid grid-cols-2">
          <div />
          <p className="w-full text-right dark:text-white">Quantity</p>
        </div>
        <div className="grid grid-cols-2">
          <div className="flex justify-start items-center flex-1 min-w-[250px] gap-2">
            <p className="text-sm">Price:</p>
            {selectedSku && <p className="font-medium">{formatCurrency(selectedSku.price)}đ x </p>}
          </div>
          <Controller
            name="qtyChange"
            control={formInfo.control}
            render={({ field }) => (
              <TextField
                isRequired
                type="text"
                className="w-full"
                value={field.value.toString()}
                onChange={(v) => {
                  const value = v.replace(/[^0-9]/g, "");
                  field.onChange(value ? Number(value) : 0);
                }}
              >
                <Input placeholder="Enter product quantity" className="text-right" />
              </TextField>
            )}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-4">
        <p className="text-sm">Total Price:</p>
        <p className="text-lg font-medium">
          {selectedSku ? formatCurrency(selectedSku.price * watchedQuantityChange) : formatCurrency(0)}đ
        </p>
      </div>
    </div>
  );
};

export default NewInventoryForm;
