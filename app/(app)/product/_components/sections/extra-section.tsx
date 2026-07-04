"use client";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { TextField, Label, Input, Skeleton, Card } from "@heroui/react";
import { useProductStore } from "../../_store/product-store";
import { ClientImage } from "@/types/product.type";
import { X } from "lucide-react";
import { ProductType } from "@/types/responses/product.response";

interface Props {
  productDetails?: ProductType | null;
  updateImages: (value: ClientImage[]) => void;
}

const ExtraSection = ({ updateImages, productDetails }: Props) => {
  const { setValue } = useFormContext();
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<ClientImage[]>([]);

  const handleSelectFile = (value: File[]) => {
    const file = value.map((item) => ({ file: item, url: URL.createObjectURL(item), name: item.name }));
    setFiles([...files, ...file]);
  };

  useEffect(() => {
    updateImages(files);
  }, [files]);

  useEffect(() => {
    if (productDetails && productDetails.images?.length > 0) {
      setFiles(productDetails.images.map((item) => ({ url: item.url, name: item.name })));
    }
  }, [productDetails]);

  return (
    <Card className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-700" variant="transparent">
      <div className="">
        <h3 className="text-lg font-semibold">Extra Information</h3>
      </div>
      <div className="flex flex-col gap-3">
        <Label>Product Image</Label>
        <Input
          multiple
          type="file"
          placeholder="upload product image"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handleSelectFile(e.target.files ? Array.from(e.target.files) : []);
          }}
        />
        <div className="flex flex-wrap gap-2 p-2">
          {files.length > 0 ? (
            files.map((item, index) => (
              <div
                key={index}
                className="relative w-[100px] h-[100px] rounded-lg overflow-hidden border border-slate-200"
              >
                <Image
                  alt={item.file?.name || "product image"}
                  src={item.url}
                  width={300}
                  height={300}
                  className="object-cover w-[100px] h-[100px]"
                />
                <div className="absolute cursor-pointer top-1 right-1">
                  <X className="bg-white rounded-full" onClick={() => setFiles(files.filter((_, i) => i !== index))} />
                </div>
              </div>
            ))
          ) : (
            <Skeleton className="w-24 h-24 rounded-lg" />
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExtraSection;
