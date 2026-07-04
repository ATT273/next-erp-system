import { useFormContext, Controller } from "react-hook-form";
import { mainCategory, subCategory } from "@/constants";
import { TextField, Label, Input, Select, ListBox, Card } from "@heroui/react";

const BasicSection = () => {
  const { control } = useFormContext();
  return (
    <Card className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-700" variant="transparent">
      <div className="">
        <h3 className="text-lg font-semibold">Basic Information</h3>
      </div>
      <div className="flex flex-col gap-3">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField isRequired type="text" className="w-full" {...field}>
              <Label>Product name</Label>
              <Input placeholder="Enter product name" />
            </TextField>
          )}
        />
        <div className="flex w-full gap-2">
          <Controller
            name="mainCategory"
            control={control}
            render={({ field }) => (
              <Select
                isRequired
                className="flex-1"
                value={field.value ? String(field.value) : ""}
                name={field.name}
                onChange={field.onChange}
              >
                <Label>Main category</Label>
                <Select.Trigger>
                  <Select.Value aria-placeholder="Select main category" />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {mainCategory.map((item) => (
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
          <Controller
            name="subCategory"
            control={control}
            render={({ field }) => (
              <Select
                isRequired
                className="flex-1"
                value={field.value ? String(field.value) : ""}
                name={field.name}
                onChange={field.onChange}
              >
                <Label>Sub category</Label>
                <Select.Trigger>
                  <Select.Value aria-placeholder="Select sub category" />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {subCategory.map((item) => (
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
        </div>
        <Controller
          name="unit"
          control={control}
          render={({ field }) => (
            <TextField isRequired type="text" className="w-full" {...field}>
              <Label>Unit</Label>
              <Input placeholder="Enter product unit" />
            </TextField>
          )}
        />
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField isRequired type="text" className="w-full" {...field}>
              <Label>Description</Label>
              <Input placeholder="Enter product description" />
            </TextField>
          )}
        />
      </div>
    </Card>
  );
};

export default BasicSection;
