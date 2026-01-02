import { redirect } from "next/navigation";
import { getSession } from "@/app/actions";
import Forbidden from "@/components/pages/forbiden";
import { getSummary } from "./actions";

import DashboardContainer from "./components/dashboard-container";
import { canAccess } from "@/utils/rbac.utils";

const Dashboard = async () => {
  const session = await getSession();
  const summary = await getSummary();

  if (!session) {
    redirect("/authenticate");
  } else {
    const _canAccess = canAccess(session.permissions, "user");
    if (!_canAccess) {
      return <Forbidden />;
    }
  }

  return (
    <div className="flex flex-col h-full gap-4 p-3 relative">
      <h1 className="font-bold text-2xl">Dashboard</h1>
      <DashboardContainer summary={summary?.data} />
    </div>
  );
};

export default Dashboard;
