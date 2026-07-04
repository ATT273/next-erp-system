"use client";

import { z } from "zod";
import { updatePassword } from "../actions";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField, Label, Input, Button } from "@heroui/react";
import { useAuth } from "@/app/(app)/_providers/authProvider";
import useToast from "@/app/(app)/_hooks/use-toast";

const formSchema = z
  .object({
    newPassword: z.string().min(6, { message: "New password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm password must be at least 6 characters" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

const PasswordForm = () => {
  const { authSession } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    mode: "onSubmit",
    defaultValues: { newPassword: "", confirmPassword: "" },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!authSession?.id) return;
    const res = await updatePassword(authSession.id, values.newPassword);
    if (res.status === 200) {
      toast.success({ title: "Success", message: "Password updated successfully" });
      form.reset();
    } else {
      toast.error({ title: "Fail", message: res.message });
    }
  };

  return (
    <form
      id="passwordForm"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 p-3 items-center"
    >
      <Controller
        name="newPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <TextField isRequired type="password" isInvalid={!!fieldState.error} className="w-full" {...field}>
            <Label>New Password</Label>
            <Input placeholder="Enter your new password" />
          </TextField>
        )}
      />
      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <TextField isRequired type="password" isInvalid={!!fieldState.error} className="w-full" {...field}>
            <Label>Confirm Password</Label>
            <Input placeholder="Confirm your password" />
          </TextField>
        )}
      />
      <Button type="submit" className="w-full bg-gray-900 text-white">
        Save
      </Button>
    </form>
  );
};

export default PasswordForm;
