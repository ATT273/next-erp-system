import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { CalendarDate, DatePicker, Form } from "@heroui/react";
import { IFormUser, IUserResponse } from "@/types/user.type";
import { useUserContext } from "../_context/user-provider";
import { parseDate, DateValue } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

interface NewUserProps {
  initialData?: null | IUserResponse;
  setOpen: (open: boolean) => void;
  handleSubmit: (data: IFormUser) => void;
}

const NewUserForm = ({ initialData = null, setOpen, handleSubmit }: NewUserProps) => {
  const { roles } = useUserContext();
  const formSchema = z.object({
    email: z.string().email({
      message: "Invalid email address",
    }),
    name: z.string().min(6, {
      message: "Name must be at least 6 characters",
    }),
    dob: z.string(),
    roleCode: z.string().min(1, {
      message: "Role is required",
    }),
  });

  const form = useForm({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      name: "",
      dob: "",
      roleCode: "",
    },
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
    <Form
      className="flex flex-col gap-3 items-center h-[calc(100%-60px)] overflow-y-auto"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Card shadow="sm" radius="md" className="w-full flex flex-col gap-3 p-4">
        <h3 className="text-lg font-semibold mb-3">Add new user</h3>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              isRequired
              ref={field.ref}
              isInvalid={fieldState.invalid}
              name={field.name}
              errorMessage={fieldState.error?.message}
              value={field.value}
              onChange={field.onChange}
              validationBehavior="aria"
              label="Fullname"
              type="text"
              placeholder="user fullname"
              className="w-full"
              size="sm"
            />
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Input
              isRequired
              isInvalid={fieldState.invalid}
              name={field.name}
              errorMessage={fieldState.error?.message}
              onChange={field.onChange}
              value={field.value}
              validationBehavior="aria"
              label="Email"
              type="text"
              placeholder="user email"
              className="w-full"
              size="sm"
            />
          )}
        />
        <Controller
          name="dob"
          control={form.control}
          render={({ field, fieldState }) => {
            const parseValue = field.value ? (parseDate(field.value) as unknown as CalendarDate) : null;
            return (
              <I18nProvider locale="en-GB">
                <DatePicker
                  label="Date of Birth"
                  className="grow"
                  size="sm"
                  validationBehavior="aria"
                  isInvalid={fieldState.invalid}
                  name={field.name}
                  value={parseValue}
                  errorMessage={fieldState.error?.message}
                  onChange={(value) => {
                    if (value) {
                      field.onChange((value as DateValue).toString());
                    }
                  }}
                />
              </I18nProvider>
            );
          }}
        />
        <Controller
          name="roleCode"
          control={form.control}
          render={({ field, fieldState }) => (
            <Select
              className="w-full"
              label="Role"
              placeholder="Select role for user"
              validationBehavior="aria"
              selectedKeys={[field.value]}
              name={field.name}
              isInvalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
            >
              {roles.map((role) => (
                <SelectItem key={role.code}>{role.name}</SelectItem>
              ))}
            </Select>
          )}
        />
      </Card>
      <footer className="sticky bottom-0 left-0 w-full flex justify-end gap-1 py-2 px-4 bg-white">
        <Button variant="light" onPress={() => setOpen(false)}>
          Close
        </Button>
        <Button type="submit" className="bg-emerald-500 text-white">
          Save
        </Button>
      </footer>
    </Form>
  );
};

export default NewUserForm;
