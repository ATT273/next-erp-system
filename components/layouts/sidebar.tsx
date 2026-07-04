"use client";
import Link from "next/link";
import { logOut } from "@/app/(auth)/authenticate/actions";
import { getLocalUser } from "@/utils/session";
import UserControlPanel from "./user-controlpanel";
import { CogIcon } from "../icons/cog";
import { User as UserIcon } from "@/components/icons/user";
import { Logout } from "@/components/icons/logout";
import { useEffect, useState } from "react";
import { MENU } from "@/constants";
import { Dropdown, Button, Label } from "@heroui/react";
import ThemeSelector from "./ThemeSelector";

const menus = MENU;

const Sidebar = () => {
  const [localUser, setLocalUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    const _localUser = getLocalUser();
    setLocalUser(_localUser);
  }, []);
  return (
    <div className="flex flex-col justify-between md:w-[15rem] h-dvh shadow-md absolute top-0 left-0 z-10 p-3">
      <ul className="p-2">
        {menus.map((menu) => (
          <Link href={menu.href} key={menu.title}>
            <li className="p-2 font-semibold rounded-sm hover:bg-slate-200 dark:hover:bg-slate-700">{menu.title}</li>
          </Link>
        ))}
      </ul>
      <div className="flex items-center justify-between w-full">
        <UserControlPanel user={localUser} />
        <Dropdown isOpen={dropdownOpen} onOpenChange={setDropdownOpen}>
          <Button isIconOnly variant="ghost" className="hover:bg-transparent">
            <CogIcon className="size-7 hover:animate-[spin_2s]" />
          </Button>
          <Dropdown.Popover style={{ width: "150px", minWidth: "150px" }}>
            <Dropdown.Menu aria-label="Static Actions">
              <Dropdown.Item id="themes" textValue="Themes" shouldCloseOnSelect={false}>
                <ThemeSelector />
              </Dropdown.Item>
              <Dropdown.Item id="profile" textValue="Profile" href="/profile" onPress={() => setDropdownOpen(false)}>
                <UserIcon className="size-7" />
                <Label>Profile</Label>
              </Dropdown.Item>
              <Dropdown.Item
                id="logout"
                textValue="Logout"
                onPress={() => {
                  logOut();
                  setDropdownOpen(false);
                }}
              >
                <Logout className="size-7" />
                <Label>Logout</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </div>
    </div>
  );
};

export default Sidebar;
