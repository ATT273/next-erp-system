"use client";

import { InventoryType } from "@/types/inventories.type";
import React, { createContext, useContext, useState } from "react";

interface DashboardProviderProps {
  children: React.ReactNode;
}

interface IDashboardContext {
  type: InventoryType;
  setType: React.Dispatch<React.SetStateAction<InventoryType>>;
}

const DashboardContext = createContext({} as IDashboardContext);

export const DashboardProvider = ({ children }: DashboardProviderProps) => {
  const [type, setType] = useState<InventoryType>("TOTAL");
  return <DashboardContext.Provider value={{ type, setType }}>{children}</DashboardContext.Provider>;
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export default DashboardProvider;
