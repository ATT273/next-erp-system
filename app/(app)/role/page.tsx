import React from "react";
import RoleTable from "./components/table";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import Forbidden from "@/components/pages/forbiden";
import NewRole from "./components/new-role-drawer";
import { getRoleList } from "./actions";
import { canAccess } from "@/utils/rbac.utils";

const Role = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/authenticate");
  } else {
    const _canAccess = canAccess(session.permissions, "user");
    if (!_canAccess) {
      return <Forbidden />;
    }
  }
  const roles = await getRoleList();
  return (
    <div className="p-3 relative">
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-2xl mb-3">Roles</h1>
        <NewRole />
      </div>
      <RoleTable roles={roles} />
    </div>
  );
};

export default Role;
