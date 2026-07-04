import { redirect } from "next/navigation";
import { getSession } from "@/app/actions";
import Forbidden from "@/components/pages/forbidden";
import { getSummary } from "./actions";

import DashboardContainer from "./components/dashboard-container";
import { canAccess } from "@/utils/rbac.utils";

const Dashboard = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/authenticate");
  } else {
    const _canAccess = canAccess(session.permissions!, "dashboard");
    if (!_canAccess || !session.roleActive) {
      return <Forbidden />;
    }
  }
  // const summary = await getSummary();

  return (
    <div className="relative flex flex-col h-full gap-4 p-3">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* <DashboardContainer summary={summary?.data} /> */}
    </div>
  );
};

export default Dashboard;
