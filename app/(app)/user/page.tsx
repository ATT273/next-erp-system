import React from "react";
import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import Forbidden from "@/components/pages/forbiden";
import PageContent from "./_components/page-content";
import { getUsers } from "./actions";
import { canAccess } from "@/utils/rbac.utils";

const User = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/authenticate");
  } else {
    const _canAccess = canAccess(session.permissions!, "user");
    if (!_canAccess || !session.roleActive) {
      return <Forbidden />;
    }
  }
  const userData = await getUsers();
  return (
    <div className="h-dvh p-3 flex-1">
      {userData.data ? <PageContent users={userData.data} /> : <div>No user data available</div>}
    </div>
  );
};

export default User;
