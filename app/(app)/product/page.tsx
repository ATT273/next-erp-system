import React from "react";
import ProductTable from "./_components/table";
import NewProduct from "./_components/drawer/new-product-drawer";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import Forbidden from "@/components/pages/forbiden";
import { canAccess } from "@/utils/rbac.utils";

const Product = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/authenticate");
  } else {
    const _canAccess = canAccess(session.permissions!, "product");
    if (!_canAccess || !session.roleActive) {
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
