import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { DatePicker, Form } from "@heroui/react";
import { IFormUser, IResetPasswordForm, IUserResponse } from "@/types/user.type";
import { useUserContext } from "../_context/user-provider";
import { parseDate, DateValue } from "@internationalized/date";

interface ResetPasswordFormProps {
  setOpen: (open: boolean) => void;
  handleSubmit: (data: IResetPasswordForm) => void;
}

const ResetPasswordForm = ({ setOpen, handleSubmit }: ResetPasswordFormProps) => {
  const { roles } = useUserContext();
  const formSchema = z.object({
    password: z.string().min(6, {
      message: "password must be at least 6 characters",
    }),
  });

  const form = useForm({
    mode: "onSubmit",
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: IResetPasswordForm) => {
    handleSubmit(data);
    form.reset();
  };

  return (
    <Form
      className="flex flex-col gap-3 items-center h-[calc(100%-60px)] overflow-y-auto"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Card shadow="sm" radius="md" className="w-full flex flex-col gap-3 p-4">
        <h3 className="text-lg font-semibold mb-3">Reset password</h3>
        <Controller
          name="password"
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
              label="New password"
              type="text"
              placeholder="Enter your new password"
              className="w-full"
              size="sm"
            />
          )}
        />
      </Card>
      <footer className="sticky bottom-0 left-0 w-full flex justify-end gap-1 py-2 px-4 bg-white">
        <Button
          variant="light"
          onPress={() => {
            form.reset();
            setOpen(false);
          }}
        >
          Close
        </Button>
        <Button type="submit" className="bg-emerald-500 text-white">
          Save
        </Button>
      </footer>
    </Form>
  );
};

export default ResetPasswordForm;
