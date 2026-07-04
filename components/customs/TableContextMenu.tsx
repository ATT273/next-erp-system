import { Button, Popover } from "@heroui/react";
import ThreeDots from "../icons/three-dot";
import { TableActionMenuItem } from "@/types/table.type";
import { useMemo, useState } from "react";
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

const TableContextMenu = ({ menuItems, resource }: TableActionMenuProps) => {
  const { authSession } = useAuth();
  const [openMenu, setOpenMenu] = useState(false);
  const permissions = authSession?.permissions;
  const _canEdit = useMemo(() => {
    if (!permissions) return false;
    return canEdit(permissions, resource);
  }, [permissions, resource]);

  const _canDelete = useMemo(() => {
    if (!permissions) return false;
    return canDelete(permissions, resource);
  }, [permissions, resource]);

  return (
    <Popover isOpen={openMenu} onOpenChange={setOpenMenu}>
      <Button isIconOnly variant="ghost">
        <ThreeDots className="text-slate-900 dark:text-white size-4" />
      </Button>
      <Popover.Content placement="bottom">
        <Popover.Dialog>
          <ul className="overflow-x-hidden rounded-md">
            {menuItems.map((item) => {
              if ((!_canEdit && item.key === "edit") || (!_canEdit && item.key === "reset-password")) return null;
              if (!_canDelete && item.key === "delete") return null;

              const Icon = item.icon;
              const iconColor = iconColors[item.key as keyof typeof iconColors] || iconColors.default;
              return (
                <li
                  key={item.key}
                  className="flex items-center gap-2 px-4 py-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-transparent"
                  onClick={() => {
                    setOpenMenu(false);
                    item.onClick();
                  }}
                >
                  <Icon className={iconColor} />
                  <p className="ml-2 text-slate-900 dark:text-white">{item.title}</p>
                </li>
              );
            })}
          </ul>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
};

export default TableContextMenu;
