import { Button } from "@heroui/react";
import { cn } from "@heroui/styles";

interface ListItemProps {
  permissionKey: string;
  action: string;
  className?: string;
  onClick?: (permissionKey: string, permission: string) => void;
}
const ListItem = ({ permissionKey, className, action, onClick }: ListItemProps) => {
  const [resource, permission] = permissionKey.split(":");
  return (
    <li className={cn("px-2 group hover:bg-zinc-300", className)}>
      <Button
        variant="ghost"
        className="justify-start w-full group-hover:bg-transparent"
        onClick={() => onClick?.(permissionKey, action)}
      >
        <span className="text-zinc-900">{resource}:</span>
        <span className="text-zinc-400">{permission}</span>
      </Button>
    </li>
  );
};

export default ListItem;
