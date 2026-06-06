"use client";

import { z } from "zod";
import { updatePassword } from "../actions";
import { getLocalUser } from "@/utils/session";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Label, Input, Button, toast } from "@heroui/react";

const formChangePWSchema = z
  .object({
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

const initalFormPassword = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const PasswordForm = () => {
  const formPassword = useForm({
    mode: "onSubmit",
    defaultValues: initalFormPassword,
    resolver: zodResolver(formChangePWSchema),
  });

  const handleSubmitChangePW = async (values: z.infer<typeof formChangePWSchema>) => {
    const _localUser = await getLocalUser();
    if (!_localUser?.id) {
      toast.danger("Fail", { description: "Can not find your user" });
      return;
    }
    const res = await updatePassword(values.newPassword, _localUser?.id);
    if (res.status === 200) {
      toast.success("Success", { description: "Password updated successfully" });
    }
  };

  return (
    <div>
      <form
        key="passwordForm"
        onSubmit={formPassword.handleSubmit(handleSubmitChangePW)}
        className="flex flex-col gap-3 p-3 items-center"
      >
        <Controller
          name="newPassword"
          control={formPassword.control}
          render={({ field, fieldState }) => (
            <TextField isRequired type="password" isInvalid={!!fieldState.error} className="w-full" {...field}>
              <Label>New Password</Label>
              <Input placeholder="Enter your new password" />
            </TextField>
          )}
        />
        <Controller
          name="confirmPassword"
          control={formPassword.control}
          render={({ field, fieldState }) => (
            <TextField isRequired type="password" isInvalid={!!fieldState.error} className="w-full" {...field}>
              <Label>Confirm Password</Label>
              <Input placeholder="Confirm your password" />
            </TextField>
          )}
        />
        <div className="flex justify-end w-full">
          <Button type="submit" className="w-full bg-gray-900 text-white">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
