"use client";

import { useMemo } from "react";
import { Download, Inbox, ShoppingCart, Upload } from "lucide-react";
import SummaryItem from "./summary-item";
import { InventoryType, ISummaryItem } from "@/types/inventories.type";

interface IDashboardSummaryProps {
  summaries: Record<InventoryType, number>;
}

const summary: Record<InventoryType, ISummaryItem> = {
  TOTAL: { key: "TOTAL", title: "Total transactions", icon: <Inbox className="size-6" />, value: 0 },
  IMPORT: { key: "IMPORT", title: "Import", icon: <Download className="size-6" />, value: 0 },
  EXPORT: { key: "EXPORT", title: "Export", icon: <Upload className="size-6" />, value: 0 },
  SALES: { key: "SALES", title: "Sales", icon: <ShoppingCart className="size-6" />, value: 0 },
};

const DashboardSummary = ({ summaries }: IDashboardSummaryProps) => {
  const summaryData = useMemo(() => {
    return {
      TOTAL: { ...summary.TOTAL, value: summaries?.TOTAL || 0 },
      IMPORT: { ...summary.IMPORT, value: summaries?.IMPORT || 0 },
      EXPORT: { ...summary.EXPORT, value: summaries?.EXPORT || 0 },
      SALES: { ...summary.SALES, value: summaries?.SALES || 0 },
    };
  }, [summaries]);

  return (
    <div className="flex gap-2">
      <SummaryItem item={summaryData.TOTAL} />
      <SummaryItem item={summaryData.IMPORT} className="bg-green-300 text-zinc-50" />
      <SummaryItem item={summaryData.EXPORT} className="bg-sky-300 text-zinc-50" />
      <SummaryItem item={summaryData.SALES} className="bg-orange-300 text-zinc-50" />
    </div>
  );
};

export default DashboardSummary;
