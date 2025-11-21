import React from "react";
import ProductTable from "./_components/table";
import NewProduct from "./_components/drawer/new-product-drawer";
import { getProducts } from "@/app/(app)/product/actions";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import { permissionsValue } from "@/constants";
import Forbidden from "@/components/pages/forbiden";

const Product = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/authenticate");
  } else {
    if (!(session.permissions & permissionsValue.ACCESS)) {
      return <Forbidden />;
    }
  }
  return (
    <div className="flex flex-col gap-4 h-full p-3 relative">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-2xl mb-3">Products list</h1>
        <NewProduct />
      </div>
      <ProductTable />
    </div>
  );
};

export default Product;
