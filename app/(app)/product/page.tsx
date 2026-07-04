import React from "react";
import ProductTable from "./_components/table";
import NewProduct from "./_components/modals/product-modal/NewProductDialog";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import Forbidden from "@/components/pages/forbidden";
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
    <div className="relative flex flex-col h-full gap-4 p-3">
      <div className="flex items-center justify-between mb-3">
        <h1 className="mb-3 text-2xl font-bold">Products list</h1>
        <NewProduct />
      </div>
      <ProductTable />
    </div>
  );
};

export default Product;
