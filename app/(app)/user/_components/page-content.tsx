"use client";

import React, { useEffect, useState } from "react";
import UserTable from "./table";
import NewUser from "./new-user-dialog";
import UserProvider from "../_context/user-provider";
import { getUsers } from "../actions";
import { getRoleList } from "../../role/actions";
import { IUserResponse } from "@/types/user.type";
import { RoleType } from "@/types/role.type";
import { useAuth } from "../../_providers/authProvider";

interface Props {
  users?: IUserResponse[];
}

const PageContent = ({ users }: Props) => {
  const [userData, setUserData] = useState<IUserResponse[]>([]);
  const [roleData, setRoleData] = useState<RoleType[]>([]);

  const getUsersData = async () => {
    const userData = await getUsers();
    if (userData.status === 200 && userData.data) {
      setUserData(userData.data);
    }
  };

  const getRolesData = async () => {
    const roleData = await getRoleList();
    setRoleData(roleData);
  };

  useEffect(() => {
    if (users) {
      setUserData(users);
    }
  }, [users]);
  useEffect(() => {
    // getUsersData();
    getRolesData();
  }, []);

  return (
    <UserProvider roles={roleData}>
      <div className="flex justify-between items-center mb-3">
        <h1 className="font-bold text-2xl mb-3">Users</h1>
        <NewUser />
      </div>
      <UserTable data={userData} />
    </UserProvider>
  );
};

export default PageContent;
