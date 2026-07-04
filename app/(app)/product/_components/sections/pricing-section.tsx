"use client";
import { formatCurrency } from "@/utils/common.util";
import { TextField, Label, Input, Card } from "@heroui/react";
import { useFormContext, Controller } from "react-hook-form";

const PricingSection = () => {
  const { control } = useFormContext();
  return (
    <Card className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-700" variant="transparent">
      <div className="">
        <h3 className="text-lg font-semibold">Pricing</h3>
      </div>
      <div className="flex flex-col gap-3">
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField
              isRequired
              type="text"
              className="w-full"
              value={formatCurrency(field.value)}
              onChange={(v) => {
                const value = v.replace(/[^0-9]/g, "");
                field.onChange(isNaN(Number(value)) ? 0 : Number(value));
              }}
            >
              <Label>Sell price</Label>
              <Input placeholder="Enter product sell price" />
            </TextField>
          )}
        />
        <Controller
          name="importPrice"
          control={control}
          render={({ field }) => (
            <TextField
              isRequired
              type="text"
              className="w-full"
              value={formatCurrency(field.value)}
              onChange={(v) => {
                const value = v.replace(/[^0-9]/g, "");
                field.onChange(isNaN(Number(value)) ? 0 : Number(value));
              }}
            >
              <Label>Import price</Label>
              <Input placeholder="Enter product import price" />
            </TextField>
          )}
        />
      </div>
    </Card>
  );
};

export default PricingSection;
