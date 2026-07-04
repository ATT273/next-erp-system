"use client";

import React, { useEffect, useState } from "react";
import UserTable from "./UserTable";
import NewUser from "./modals/user-modal/NewUserDialog";
import UserProvider from "../_context/user-provider";
import { getRoles } from "../../role/actions";
import { RoleType } from "@/types/role.type";
import useGetUsers from "../_hooks/use-get-users";

const PageContent = () => {
  const [roleData, setRoleData] = useState<RoleType[]>([]);
  const { usersData } = useGetUsers();

  useEffect(() => {
    getRoles({ page: 1, limit: 10 }).then((res) => setRoleData(res.data.data));
  }, []);

  return (
    <UserProvider roles={roleData}>
      <div className="flex items-center justify-between mb-3">
        <h1 className="mb-3 text-2xl font-bold">Users</h1>
        <NewUser />
      </div>
      <UserTable data={usersData} />
    </UserProvider>
  );
};

export default PageContent;
