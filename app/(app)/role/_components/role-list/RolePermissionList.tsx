import { Resource } from "@/types/auth.types";
import React from "react";
import ListHeaderWrapper from "./ListHeaderWrapper";
import ListContentWrapper from "./ListContentWrapper";
import { Minus, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@heroui/react";
import ListWrapper from "./ListWrapper";
import ListItem from "./ListItem";

interface RolePermissionListProps {
  permissionsMap: Map<Resource, string[]>;
  unassignAll: () => void;
  handleAssignPermission: (permissionKey: string, action: string) => void;
  unassignResourcePermission: (resource: Resource) => void;
}
const RolePermissionList = ({
  unassignAll,
  unassignResourcePermission,
  handleAssignPermission,
  permissionsMap,
}: RolePermissionListProps) => {
  return (
    <ListWrapper className="flex-1">
      <ListHeaderWrapper className="text-emerald-300">
        <ShieldCheck />
        <h3 className="flex-1 text-lg font-bold text-zinc-900">Role Permissions</h3>
        <Button variant="ghost" className="hover:bg-transparent" onClick={unassignAll}>
          <Minus className="text-red-300" />
        </Button>
      </ListHeaderWrapper>
      <ListContentWrapper className="max-h-[340px]">
        {Array.from(permissionsMap.entries()).map((item) => {
          const [key, value] = item;
          if (!value || value.length === 0) return null;
          return (
            <div key={key}>
              <div className="flex flex-row items-center justify-between">
                <p className="px-2 py-1 font-semibold capitalize text-sky-600">{key}</p>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent"
                  onClick={() => unassignResourcePermission(key)}
                >
                  <Minus className="text-red-300" />
                </Button>
              </div>
              <ul>
                {value.map((permission: string) => {
                  return (
                    <ListItem
                      key={permission}
                      permissionKey={permission}
                      action="remove"
                      onClick={handleAssignPermission}
                    />
                  );
                })}
              </ul>
            </div>
          );
        })}
      </ListContentWrapper>
    </ListWrapper>
  );
};

export default RolePermissionList;
