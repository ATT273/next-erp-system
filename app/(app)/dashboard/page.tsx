import { redirect } from "next/navigation";

import { getSession } from "@/app/actions";
import Forbidden from "@/components/pages/forbiden";
import { permissionsValue } from "@/constants";
import { getSummary } from "./actions";

import DashboardContainer from "./components/dashboard-container";

const Dashboard = async () => {
  const session = await getSession();
  const summary = await getSummary();

  if (!session) {
    redirect("/authenticate");
  } else {
    if (!(session.permissions & permissionsValue.ACCESS)) {
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
