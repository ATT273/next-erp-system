"use client";
import { formatCurrency } from "@/utils/common.util";
import { TextField, Label, Input } from "@heroui/react";
import { useFormContext, Controller } from "react-hook-form";

const PricingSection = () => {
  const { control } = useFormContext();
  return (
    <div className="shadow-sm rounded-md w-full p-2">
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-3">Pricing</h3>
      </div>
      <div className="flex flex-col gap-3">
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField isRequired type="text" className="w-full" value={formatCurrency(field.value)} onChange={(v) => {
              const value = v.replace(/[^0-9]/g, "");
              field.onChange(isNaN(Number(value)) ? 0 : Number(value));
            }}>
              <Label>Sell price</Label>
              <Input placeholder="Enter product sell price" />
            </TextField>
          )}
        />
        <Controller
          name="importPrice"
          control={control}
          render={({ field }) => (
            <TextField isRequired type="text" className="w-full" value={formatCurrency(field.value)} onChange={(v) => {
              const value = v.replace(/[^0-9]/g, "");
              field.onChange(isNaN(Number(value)) ? 0 : Number(value));
            }}>
              <Label>Import price</Label>
              <Input placeholder="Enter product import price" />
            </TextField>
          )}
        />
      </div>
    </div>
  );
};

export default PricingSection;
