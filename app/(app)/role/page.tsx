import React from "react";
import RoleTable from "./_components/table";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import Forbidden from "@/components/pages/forbidden";
import NewRoleDialogTrigger from "./_components/role-dialog/NewRoleDialogTrigger";
import { getRoles } from "./actions";
import { canAccess } from "@/utils/rbac.utils";

const Role = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/authenticate");
  } else {
    const _canAccess = canAccess(session.permissions!, "role");
    if (!_canAccess || !session.roleActive) {
      return <Forbidden />;
    }
  }
  const roles = await getRoles({
    page: 1,
    limit: 10,
  });
  console.log("roles", roles);
  return (
    <div className="relative p-3">
      <div className="flex items-center justify-between mb-3">
        <h1 className="mb-3 text-2xl font-bold">Roles</h1>
        <NewRoleDialogTrigger />
      </div>
      {roles?.data.data && <RoleTable roles={roles?.data.data} />}
    </div>
  );
};

export default Role;
