"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { ClientImage, IProductForm, IProductSku } from "@/types/product.type";
import BasicSection from "../sections/basic-section";
import PricingSection from "../sections/pricing-section";
import AttributeSection from "../sections/attribute-section";
import ExtraSection from "../sections/extra-section";
import Footer from "../drawer/footer";
import { useProductStore } from "../../_store/product-store";

interface Props {
  handleSubmit: (values: IProductForm & { skuItems: IProductSku[]; files: ClientImage[] }) => void;
  closeDrawer: (open: boolean) => void;
}

const ProductForm = ({ handleSubmit, closeDrawer }: Props) => {
  const [skuItems, setSKUItems] = useState<IProductSku[]>([]);
  const [files, setFiles] = useState<ClientImage[]>([]);
  const { productDetails } = useProductStore();

  const formInfoSchema = z.object({
    name: z.string().min(6, {
      message: "Name must be at least 6 characters",
    }),
    mainCategory: z.string().min(1, {
      message: "please select main category",
    }),
    subCategory: z.string().min(1, {
      message: "Please select sub category",
    }),
    unit: z.string().min(1, {
      message: "Unit is required",
    }),
    price: z.number().min(1, { message: "Price is required" }),
    importPrice: z.number().min(1, { message: "Import price is required" }),
    // qty: z.number().min(1, { message: "Quantity is required" }),
    sizes: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  });

  const formInfo = useForm<z.infer<typeof formInfoSchema>>({
    resolver: zodResolver(formInfoSchema),
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
    if (productDetails.id) {
      // fetch productDetail
      formInfo.reset({
        name: productDetails.name,
        mainCategory: productDetails.mainCategory.toString(),
        subCategory: productDetails.subCategory.toString(),
        unit: productDetails.unit,
        price: productDetails.price,
        importPrice: productDetails.importPrice,
        // qty: productDetails.qty,
        sizes: productDetails.sizes,
        description: productDetails.description,
      });
    }
  }, [productDetails]);

  return (
    <FormProvider {...formInfo}>
      <form
        key="productForm"
        onSubmit={formInfo.handleSubmit(onSubmit)}
        className="flex flex-col gap-3 items-center h-[calc(100%-60px)] overflow-y-auto px-4 pt-4"
      >
        <BasicSection />
        <PricingSection />
        <AttributeSection updateSkuItems={setSKUItems} />
        <ExtraSection updateImages={setFiles} />
      </form>
      <Footer closeDrawer={closeDrawer} handleSubmit={onSubmit} />
    </FormProvider>
  );
};

export default ProductForm;
