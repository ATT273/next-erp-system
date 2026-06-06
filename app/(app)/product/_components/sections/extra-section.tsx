"use client";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import Image from "next/image";
import { TextField, Label, Input, Skeleton } from "@heroui/react";
import { useProductStore } from "../../_store/product-store";
import { ClientImage } from "@/types/product.type";
import { X } from "lucide-react";

interface Props {
  updateImages: (value: ClientImage[]) => void;
}

const ExtraSection = ({ updateImages }: Props) => {
  const { setValue } = useFormContext();
  const [tags, setTags] = useState<string[]>([]);
  const [files, setFiles] = useState<ClientImage[]>([]);
  const { productDetails } = useProductStore();

  const handleSelectFile = (value: File[]) => {
    const file = value.map((item) => ({ file: item, url: URL.createObjectURL(item), name: item.name }));
    setFiles([...files, ...file]);
  };

  useEffect(() => { updateImages(files); }, [files]);

  useEffect(() => {
    if (productDetails && productDetails.images?.length > 0) {
      setFiles(productDetails.images.map((item) => ({ url: item.url, name: item.name })));
    }
  }, [productDetails]);

  return (
    <div className="shadow-sm rounded-md w-full p-2">
      <div className="mb-2">
        <h3 className="text-lg font-semibold mb-3">Extra Information</h3>
      </div>
      <div className="flex flex-col gap-3">
        <TextField type="file" className="w-full" onChange={(v) => {
          // file input handled via native onChange below
        }}>
          <Label>Product Image</Label>
          <Input
            multiple
            placeholder="upload product image"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleSelectFile(e.target.files ? Array.from(e.target.files) : []);
            }}
          />
        </TextField>
        <div className="flex gap-2 flex-wrap p-2">
          {files.length > 0 ? (
            files.map((item, index) => (
              <div key={index} className="relative w-[100px] h-[100px] rounded-lg overflow-hidden border border-slate-200">
                <Image alt={item.file?.name || "product image"} src={item.url} width={300} height={300} className="object-cover w-[100px] h-[100px]" />
                <div className="absolute top-1 right-1 cursor-pointer">
                  <X className="bg-white rounded-full" onClick={() => setFiles(files.filter((_, i) => i !== index))} />
                </div>
              </div>
            ))
          ) : (
            <Skeleton className="h-24 w-24 rounded-lg" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtraSection;
