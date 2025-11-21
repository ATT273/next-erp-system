import React from "react";
import { DashboardProvider } from "./dashboard-provider";
import DashboardSummary from "./dashboard-summary";
import DashboardTable from "./table";
import { InventoryType } from "@/types/inventories.type";

interface IDashboardContainerProps {
  summary: Record<InventoryType, number>;
}

const DashboardContainer = ({ summary }: IDashboardContainerProps) => {
  return (
    <DashboardProvider>
      <div className="flex flex-col gap-4 flex-1">
        <DashboardSummary summaries={summary} />
        <DashboardTable />
      </div>
    </DashboardProvider>
  );
};

export default DashboardContainer;
