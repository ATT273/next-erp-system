"use client";
import { IProductSku } from "@/types/product.type";
import { useEffect, useState } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { useProductStore } from "../../_store/product-store";
import TagInput from "@/components/customs/TagInput";
import { Card } from "@heroui/react";

interface Props {
  updateSkuItems: (value: IProductSku[]) => void;
}

const AttributeSection = ({ updateSkuItems }: Props) => {
  const { control } = useFormContext();
  const [skuItems, setSKUItems] = useState<IProductSku[]>([]);
  const _mainCategoryId = useWatch({ name: "mainCategory" });
  const _subCategoryId = useWatch({ name: "subCategory" });
  const { productDetails } = useProductStore();

  useEffect(() => {
    updateSkuItems(skuItems);
  }, [skuItems]);

  useEffect(() => {
    if (productDetails.skus) setSKUItems(productDetails.skus);
  }, [productDetails]);

  return (
    <Card className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-700" variant="transparent">
      <div className="">
        <h3 className="text-lg font-semibold">Attribute</h3>
      </div>
      <div className="flex flex-col gap-3">
        <Controller
          name="sizes"
          control={control}
          render={({ field }) => (
            <TagInput
              label="Sizes"
              value={field.value ?? []}
              onChange={field.onChange}
              disabled={!_mainCategoryId || !_subCategoryId}
              placeholder="Enter size and press Enter, Space or comma..."
            />
          )}
        />
      </div>
    </Card>
  );
};

export default AttributeSection;
