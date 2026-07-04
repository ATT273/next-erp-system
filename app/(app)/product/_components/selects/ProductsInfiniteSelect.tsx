import { TextField, Label, Input, Select, ListBox } from "@heroui/react";
import useGetProductsInfiniteSearch from "../../_hooks/use-get-products-infinite-search";
import InfiniteSentinel from "@/components/customs/InfiniteSentinel";

interface ProductInfiniteSelectProps {
  value?: string | null;
  onValueChange: (value: string) => void;
}
const ProductsInfiniteSelect = ({ value, onValueChange }: ProductInfiniteSelectProps) => {
  const { productsData, isFetching, hasNextPage, fetchNextPage } = useGetProductsInfiniteSearch();

  return (
    <Select isRequired value={value ?? ""} onChange={(v) => onValueChange(v as string)} placeholder="Select product">
      <Label>Product</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {productsData.map((item) => (
            <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
              {item.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
        <InfiniteSentinel onIntersect={fetchNextPage} enabled={hasNextPage && !isFetching} />
      </Select.Popover>
    </Select>
  );
};

export default ProductsInfiniteSelect;
