import { Button } from "@heroui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@heroui/popover";
import ThreeDots from "../icons/three-dot";
import { TableActionMenuItem } from "@/types/table.type";
import { useMemo } from "react";
import { useAuth } from "@/app/(app)/_providers/authProvider";
import { canDelete, canEdit } from "@/utils/rbac.utils";
import { Resource } from "@/types/auth.types";

interface TableActionMenuProps {
  menuItems: TableActionMenuItem[];
  resource: Resource;
}

const iconColors = {
  edit: "text-teal-500 size-4",
  delete: "text-red-500 size-4",
  default: "text-teal-500 size-4",
};
const TableActionMenu = ({ menuItems, resource }: TableActionMenuProps) => {
  const { permissions } = useAuth();
  const _canEdit = useMemo(() => {
    if (!permissions) return false;
    return canEdit(permissions, resource);
  }, [permissions, resource]);

  const _canDelete = useMemo(() => {
    if (!permissions) return false;
    return canDelete(permissions, resource);
  }, [permissions, resource]);

  return (
    <Popover key={"context-menu"} placement="bottom">
      <PopoverTrigger>
        <Button isIconOnly variant="light">
          <ThreeDots className="text-slate-900 size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="rounded-md p-0 overflow-x-hidden">
        <ul>
          {menuItems.map((item) => {
            if ((!_canEdit && item.key === "edit") || (!_canEdit && item.key === "reset-password")) return null;
            if (!_canDelete && item.key === "delete") return null;

            const Icon = item.icon;
            const iconColor = iconColors[item.key as keyof typeof iconColors] || iconColors.default;
            return (
              <li
                key={item.key}
                className="flex gap-2 px-4 py-2 items-center text-left cursor-pointer hover:bg-gray-100"
                onClick={() => item.onClick()}
              >
                <Icon className={iconColor} />
                <p className="text-slate-900 ml-2">{item.title}</p>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
};

export default TableActionMenu;
