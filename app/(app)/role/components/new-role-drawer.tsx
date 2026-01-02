"use client";
import { Drawer, Button, Input, DrawerContent, Textarea, Card, Checkbox, DrawerHeader } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { PERMISSION_VALUE, MENU } from "@/constants";
import { RoleType } from "@/types/role.type";
import { createRole } from "@/app/(app)/role/actions";
import useToast from "../../_hooks/use-toast";

const formInfoSchema = z.object({
  name: z.string().min(6, {
    message: "Name must be at least 6 characters",
  }),
  code: z.string().min(3, {
    message: "Code must be at least 3 characters",
  }),
  description: z.string().optional(),
  permissions: z.object({}).optional(),
});

const initialValues: RoleType = {
  name: "",
  description: "",
  code: "",
  active: true,
  permissions: { dashboard: 0 },
};
const NewRole = () => {
  const { toast } = useToast();
  const [opened, setOpened] = useState(false);
  const [permissions, setPermissions] = useState({
    access: false,
    edit: false,
    delete: false,
  });
  const formInfo = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(formInfoSchema),
  });

  const handleSubmit = async (values: z.infer<typeof formInfoSchema>) => {
    values.permissions = JSON.stringify(values.permissions);
    const res = await createRole(values);
    if (res.status === 200) {
      toast.success({
        title: "Success",
        message: "Role created successfully",
      });
    } else {
      toast.error({
        title: "Failed",
        message: res.message,
      });
    }
  };
  const handleAssignPermission = (menu: string, permission: number, action: boolean) => {
    const permissions = formInfo.getValues("permissions");
    if (action) {
      permissions[menu] |= permission;
    } else {
      permissions[menu] &= ~permission;
    }

    formInfo.setValue("permissions", permissions);
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      formInfo.reset();
    }
    setOpened(isOpen);
  };
  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const user = JSON.parse(localUser);
      const _permissions = {
        access: !!(user.permissions & PERMISSION_VALUE.ACCESS),
        edit: !!(user.permissions & PERMISSION_VALUE.EDIT),
        delete: !!(user.permissions & PERMISSION_VALUE.DELETE),
      };
      setPermissions(_permissions);
    }
  }, []);

  return (
    <div>
      <Drawer isOpen={opened} onOpenChange={onOpenChange} size="xl" className="">
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1">Add new role</DrawerHeader>
          <form
            key="productForm"
            onSubmit={formInfo.handleSubmit(handleSubmit)}
            className="flex flex-col gap-3 items-center h-[calc(100%-60px)] overflow-y-auto py-2 px-4"
          >
            <Card shadow="sm" radius="md" className="flex gap-2 w-full p-2">
              <Controller
                name="name"
                control={formInfo.control}
                render={({ field }) => (
                  <Input isRequired label="Role name" type="text" size="sm" placeholder="Enter role name" {...field} />
                )}
              />
              <Controller
                name="description"
                control={formInfo.control}
                render={({ field }) => (
                  <Textarea
                    isRequired
                    label="Role description"
                    size="sm"
                    placeholder="Enter role description"
                    {...field}
                  />
                )}
              />
              <Controller
                name="code"
                control={formInfo.control}
                render={({ field }) => (
                  <Input isRequired label="Role code" type="text" size="sm" placeholder="Enter role code" {...field} />
                )}
              />
            </Card>
            <Card shadow="sm" radius="md" className="w-full p-2 max-h-[400px] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-3">Permissions</h3>
              <div className="flex flex-col gap-2">
                {MENU.map((menu) => {
                  const permissions = formInfo.watch("permissions")[menu.key];
                  return (
                    <div className="flex flex-col gap-2" key={menu.key}>
                      <h3 className="font-semibold text-md">{menu.title}</h3>
                      <div className="flex gap-2 px-3">
                        {menu.permissions.map((permission) => {
                          const _permission = PERMISSION_VALUE[permission as keyof typeof PERMISSION_VALUE];
                          return (
                            <div key={permission}>
                              <Checkbox
                                isSelected={!!(permissions & _permission)}
                                onChange={(e) => handleAssignPermission(menu.key, _permission, e.currentTarget.checked)}
                              >
                                {permission}
                              </Checkbox>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </form>
          <footer className="sticky bottom-0 left-0 w-full flex justify-end gap-1 py-2 px-4 bg-white">
            <Button variant="light" type="button" onPress={() => setOpened(false)}>
              Close
            </Button>
            <Button onPress={() => handleSubmit(formInfo.getValues())}>Save</Button>
          </footer>
        </DrawerContent>
      </Drawer>
      <Button
        onPress={() => setOpened(true)}
        disabled={!permissions.edit}
        className="hover:bg-emerald-500 hover:text-white font-semibold"
      >
        Add new role
      </Button>
    </div>
  );
};

export default NewRole;
