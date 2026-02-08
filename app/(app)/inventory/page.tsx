import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import Forbidden from "@/components/pages/forbiden";
import InventoryTable from "./_components/table";
import NewInventory from "./_components/modal/new-inventory-modal";
import { canAccess } from "@/utils/rbac.utils";

const Product = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/authenticate");
  } else {
    const _canAccess = canAccess(session.permissions!, "inventory");
    if (!_canAccess || !session.roleActive) {
      return <Forbidden />;
    }
  }

  return (
    <div className="flex flex-col p-3 relative w-full h-full">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-2xl mb-3">Inventory list</h1>
        <NewInventory />
      </div>
      <InventoryTable />
    </div>
  );
};

export default Product;
