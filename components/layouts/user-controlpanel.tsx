"use client";
import { Avatar } from "@heroui/react";

const UserControlPanel = ({ user }: { user: any }) => {
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="flex gap-2 items-center">
      <Avatar>
        <Avatar.Fallback>{initials}</Avatar.Fallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <span className="text-sm font-semibold">{user?.name}</span>
        <span className="text-xs text-muted">{user?.email}</span>
      </div>
    </div>
  );
};

export default UserControlPanel;
