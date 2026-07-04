import { Resource } from "@/types/auth.types";
import React from "react";
import ListHeaderWrapper from "./ListHeaderWrapper";
import ListContentWrapper from "./ListContentWrapper";
import { Plus, ShieldCheck } from "lucide-react";
import { Button } from "@heroui/react";
import ListWrapper from "./ListWrapper";
import ListItem from "./ListItem";

interface AvailablePermissionListProps {
  permissionsMap: Map<Resource, string[]>;
  assignAll: () => void;
  handleAssignPermission: (permissionKey: string, action: string) => void;
  assignResourcePermission: (resource: Resource) => void;
}
const AvailablePermissionList = ({
  assignAll,
  assignResourcePermission,
  handleAssignPermission,
  permissionsMap,
}: AvailablePermissionListProps) => {
  return (
    <ListWrapper className="flex-1">
      <ListHeaderWrapper className="sticky top-0 left-0 text-emerald-300">
        <ShieldCheck />
        <h3 className="flex-1 text-lg font-bold text-zinc-900">Available Permissions</h3>
        <Button variant="ghost" className="hover:bg-transparent" onClick={assignAll}>
          <Plus className="text-emerald-300" />
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
                <Button variant="ghost" className="hover:bg-transparent" onClick={() => assignResourcePermission(key)}>
                  <Plus className="text-emerald-300" />
                </Button>
              </div>
              <ul>
                {value.map((permission: string) => {
                  return (
                    <ListItem
                      key={permission}
                      permissionKey={permission}
                      action="assign"
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

export default AvailablePermissionList;
