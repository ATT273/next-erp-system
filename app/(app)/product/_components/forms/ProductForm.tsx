"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ClientImage, IProductSku, ProductType } from "@/types/responses/product.response";
import BasicSection from "../sections/basic-section";
import PricingSection from "../sections/pricing-section";
import AttributeSection from "../sections/attribute-section";
import ExtraSection from "../sections/extra-section";
import { formProductSchema, IProductFormValues } from "../../_types/product.schema";

interface Props {
  productDetails?: ProductType | null;
  handleSubmit: (values: IProductFormValues & { skuItems: IProductSku[]; files: ClientImage[] }) => void;
  closeDrawer: (open: boolean) => void;
}

const ProductForm = ({ productDetails, handleSubmit, closeDrawer }: Props) => {
  const [skuItems, setSKUItems] = useState<IProductSku[]>([]);
  const [files, setFiles] = useState<ClientImage[]>([]);

  const formInfo = useForm<z.infer<typeof formProductSchema>>({
    resolver: zodResolver(formProductSchema),
    defaultValues: {
      mainCategory: "",
      subCategory: "",
      name: "",
      unit: "",
      price: 0,
      importPrice: 0,
      // qty: 0,
      sizes: [],
      description: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = () => {
    const formValues = formInfo.getValues();
    const data = {
      ...formValues,
      mainCategory: formValues.mainCategory,
      subCategory: formValues.subCategory,
      importPrice: formValues.importPrice,
      description: formValues.description ?? "",
      sizes: formValues.sizes ?? [],
      skuItems,
      files,
    };
    handleSubmit(data);
  };

  useEffect(() => {
    if (productDetails?.id) {
      // fetch productDetail
      formInfo.reset({
        name: productDetails.name,
        mainCategory: productDetails.mainCategory.toString(),
        subCategory: productDetails.subCategory.toString(),
        unit: productDetails.unit,
        price: productDetails.price,
        importPrice: productDetails.importPrice,
        sizes: productDetails.sizes,
        description: productDetails.description,
      });
    }
  }, [productDetails]);

  return (
    <FormProvider {...formInfo}>
      <form
        id="productForm"
        key="productForm"
        onSubmit={formInfo.handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-3 px-4 pt-4 overflow-y-auto"
      >
        <BasicSection />
        <PricingSection />
        <AttributeSection updateSkuItems={setSKUItems} />
        <ExtraSection updateImages={setFiles} productDetails={productDetails} />
      </form>
    </FormProvider>
  );
};

export default ProductForm;
