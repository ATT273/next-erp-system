import { useForm, Controller, FormProvider } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, TextField, Label, Input, Select, ListBox, DatePicker } from "@heroui/react";
import { IFormUser, IUserResponse } from "@/types/user.type";
import { useUserContext } from "../../_context/user-provider";
import { parseDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

interface NewUserProps {
  initialData?: null | IUserResponse;
  handleSubmit: (data: IFormUser) => void;
}

const NewUserForm = ({ initialData = null, handleSubmit }: NewUserProps) => {
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

  const onSubmit = async (data: IFormUser) => {
    handleSubmit(data);
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        email: initialData.email,
        dob: initialData.dob,
        roleCode: initialData.roleCode,
      });
    }
  }, [initialData]);

  return (
    <FormProvider {...form}>
      <form
        id="userForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-3 px-4 pt-4 overflow-y-auto"
      >
        <Card className="flex flex-col w-full gap-3 p-4" variant="transparent">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                isRequired
                isInvalid={fieldState.invalid}
                className="w-full"
                value={field.value}
                name={field.name}
                onChange={field.onChange}
              >
                <Label>Fullname</Label>
                <Input placeholder="User fullname" />
              </TextField>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField
                isRequired
                type="email"
                isInvalid={fieldState.invalid}
                className="w-full"
                value={field.value}
                name={field.name}
                onChange={field.onChange}
              >
                <Label>Email</Label>
                <Input placeholder="User email" />
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
              <Select
                className="w-full"
                isInvalid={fieldState.invalid}
                value={field.value}
                name={field.name}
                onChange={field.onChange}
              >
                <Label>Role</Label>
                <Select.Trigger>
                  <Select.Value aria-placeholder="Select role for user" />
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
        </Card>
      </form>
    </FormProvider>
  );
};

export default NewUserForm;
