import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, TextField, Label, Input, Select, ListBox, DatePicker, Form } from "@heroui/react";
import { IFormUser, IUserResponse } from "@/types/user.type";
import { useUserContext } from "../_context/user-provider";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

interface NewUserProps {
  initialData?: null | IUserResponse;
  setOpen: (open: boolean) => void;
  handleSubmit: (data: IFormUser) => void;
}

const NewUserForm = ({ initialData = null, setOpen, handleSubmit }: NewUserProps) => {
  const { roles } = useUserContext();
  const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().min(6, { message: "Name must be at least 6 characters" }),
    dob: z.string(),
    roleCode: z.string().min(1, { message: "Role is required" }),
  });

  const form = useForm({
    mode: "onSubmit",
    defaultValues: { email: "", name: "", dob: "", roleCode: "" },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: IFormUser) => { handleSubmit(data); };

  useEffect(() => {
    if (initialData) {
      form.reset({ name: initialData.name, email: initialData.email, dob: initialData.dob, roleCode: initialData.roleCode });
    }
  }, [initialData]);

  return (
    <Form className="flex flex-col gap-3 items-center h-[calc(100%-60px)] overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-full flex flex-col gap-3 p-4 shadow-sm">
        <Card.Content>
          <h3 className="text-lg font-semibold mb-3">Add new user</h3>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField isRequired isInvalid={fieldState.invalid} className="w-full" value={field.value} name={field.name} onChange={field.onChange}>
                <Label>Fullname</Label>
                <Input placeholder="user fullname" />
              </TextField>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField isRequired type="email" isInvalid={fieldState.invalid} className="w-full" value={field.value} name={field.name} onChange={field.onChange}>
                <Label>Email</Label>
                <Input placeholder="user email" />
              </TextField>
            )}
          />
          <Controller
            name="dob"
            control={form.control}
            render={({ field }) => (
              <I18nProvider locale="en-GB">
                <DatePicker
                  className="w-full"
                  value={field.value ? (parseDate(field.value) as any) : null}
                  onChange={(v) => v && field.onChange(v.toString())}
                >
                  <Label>Date of Birth</Label>
                </DatePicker>
              </I18nProvider>
            )}
          />
          <Controller
            name="roleCode"
            control={form.control}
            render={({ field, fieldState }) => (
              <Select className="w-full" isInvalid={fieldState.invalid} value={field.value} name={field.name} onChange={field.onChange}>
                <Label>Role</Label>
                <Select.Trigger>
                  <Select.Value placeholder="Select role for user" />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {roles.map((role) => (
                      <ListBox.Item key={role.code} id={role.code} textValue={role.name}>
                        {role.name}
                        <ListBox.ItemIndicator />
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>
            )}
          />
        </Card.Content>
      </Card>
      <footer className="sticky bottom-0 left-0 w-full flex justify-end gap-1 py-2 px-4 bg-white">
        <Button onPress={() => setOpen(false)}>Close</Button>
        <Button type="submit" className="bg-emerald-500 text-white">Save</Button>
      </footer>
    </Form>
  );
};

export default NewUserForm;
