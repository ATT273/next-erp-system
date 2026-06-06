"use client";
import { Drawer, Button, TextField, Label, Input, Card, Checkbox, useOverlayState } from "@heroui/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { PERMISSION_VALUE, MENU } from "@/constants";
import { RoleType } from "@/types/role.type";
import { createRole } from "@/app/(app)/role/actions";
import useToast from "../../_hooks/use-toast";

const formInfoSchema = z.object({
  name: z.string().min(6, { message: "Name must be at least 6 characters" }),
  code: z.string().min(3, { message: "Code must be at least 3 characters" }),
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
  const state = useOverlayState();
  const [permissions, setPermissions] = useState({ access: false, edit: false, delete: false });
  const formInfo = useForm({
    defaultValues: initialValues,
    resolver: zodResolver(formInfoSchema),
  });

  const handleSubmit = async (values: z.infer<typeof formInfoSchema>) => {
    values.permissions = JSON.stringify(values.permissions);
    const res = await createRole(values);
    if (res.status === 200) {
      toast.success({ title: "Success", message: "Role created successfully" });
    } else {
      toast.error({ title: "Failed", message: res.message });
    }
  };

  const handleAssignPermission = (menu: string, permission: number, action: boolean) => {
    const perms = formInfo.getValues("permissions");
    if (action) {
      perms[menu] |= permission;
    } else {
      perms[menu] &= ~permission;
    }
    formInfo.setValue("permissions", perms);
  };

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (localUser) {
      const user = JSON.parse(localUser);
      setPermissions({
        access: !!(user.permissions & PERMISSION_VALUE.ACCESS),
        edit: !!(user.permissions & PERMISSION_VALUE.EDIT),
        delete: !!(user.permissions & PERMISSION_VALUE.DELETE),
      });
    }
  }, []);

  return (
    <div>
      <Drawer state={state}>
        <Drawer.Backdrop>
          <Drawer.Content placement="right">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Header>
                <Drawer.Heading>Add new role</Drawer.Heading>
              </Drawer.Header>
              <Drawer.Body>
                <form
                  key="productForm"
                  id="new-role-form"
                  onSubmit={formInfo.handleSubmit(handleSubmit)}
                  className="flex flex-col gap-3 items-center overflow-y-auto py-2"
                >
                  <Card className="flex gap-2 w-full p-2 shadow-sm">
                    <Card.Content>
                      <Controller
                        name="name"
                        control={formInfo.control}
                        render={({ field, fieldState }) => (
                          <TextField isRequired type="text" isInvalid={!!fieldState.error} className="w-full" {...field}>
                            <Label>Role name</Label>
                            <Input placeholder="Enter role name" />
                          </TextField>
                        )}
                      />
                      <Controller
                        name="description"
                        control={formInfo.control}
                        render={({ field, fieldState }) => (
                          <TextField isRequired isInvalid={!!fieldState.error} className="w-full" {...field}>
                            <Label>Role description</Label>
                            <Input placeholder="Enter role description" />
                          </TextField>
                        )}
                      />
                      <Controller
                        name="code"
                        control={formInfo.control}
                        render={({ field, fieldState }) => (
                          <TextField isRequired type="text" isInvalid={!!fieldState.error} className="w-full" {...field}>
                            <Label>Role code</Label>
                            <Input placeholder="Enter role code" />
                          </TextField>
                        )}
                      />
                    </Card.Content>
                  </Card>
                  <Card className="w-full p-2 max-h-[400px] overflow-y-auto shadow-sm">
                    <Card.Content>
                      <h3 className="text-lg font-semibold mb-3">Permissions</h3>
                      <div className="flex flex-col gap-2">
                        {MENU.map((menu) => {
                          const menuPerms = formInfo.watch("permissions")[menu.key];
                          return (
                            <div className="flex flex-col gap-2" key={menu.key}>
                              <h3 className="font-semibold text-md">{menu.title}</h3>
                              <div className="flex gap-2 px-3">
                                {menu.permissions.map((permission) => {
                                  const _permission = PERMISSION_VALUE[permission as keyof typeof PERMISSION_VALUE];
                                  return (
                                    <Checkbox
                                      key={permission}
                                      isSelected={!!(menuPerms & _permission)}
                                      onChange={(v) => handleAssignPermission(menu.key, _permission, v)}
                                    >
                                      <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                                      <Checkbox.Content><Label>{permission}</Label></Checkbox.Content>
                                    </Checkbox>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Card.Content>
                  </Card>
                </form>
              </Drawer.Body>
              <Drawer.Footer>
                <Button onPress={() => state.close()}>Close</Button>
                <Button onPress={() => handleSubmit(formInfo.getValues())}>Save</Button>
              </Drawer.Footer>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>
      <Button onPress={() => state.open()} disabled={!permissions.edit} className="hover:bg-emerald-500 hover:text-white font-semibold">
        Add new role
      </Button>
    </div>
  );
};

export default NewRole;
