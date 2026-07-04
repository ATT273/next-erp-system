import { mainCategory, subCategory } from "@/constants";

export const getMainCategoryCode = (value: string) => {
  const mainCategoryCode = mainCategory.find((item) => item.value === value)?.code;
  return mainCategoryCode ?? "N/A";
};

export const getSubCategoryCode = (value: string) => {
  const subCategoryCode = subCategory.find((item) => item.value === value)?.code;
  return subCategoryCode ?? "N/A";
};
