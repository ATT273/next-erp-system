"use client";

import { z } from "zod";
import { updateInfo } from "../actions";
import { useEffect } from "react";
import { getUserDetails } from "@/app/(app)/user/actions";
import { TextField, Label, Input, Button, DatePicker } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { parseDate } from "@internationalized/date";
import { zodResolver } from "@hookform/resolvers/zod";
import { I18nProvider } from "@react-aria/i18n";
import { useAuth } from "@/app/(app)/_providers/authProvider";
import useToast from "@/app/(app)/_hooks/use-toast";

const formInfoSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(6, { message: "Name must be at least 6 characters" }),
  dob: z.string(),
});

const InforForm = () => {
  const { authSession } = useAuth();
  const { toast } = useToast();

  const formInfo = useForm({
    defaultValues: { email: "", name: "", dob: "" },
    mode: "onChange",
    resolver: zodResolver(formInfoSchema),
  });

  useEffect(() => {
    if (!authSession?.id) return;
    getUserDetails(authSession.id).then((res) => {
      if (res.status === 200 && res.data != null) {
        const { email, name, dob } = res.data;
        formInfo.reset({ email, name, dob });
      }
    });
  }, [authSession?.id]);

  const onSubmit = async (values: z.infer<typeof formInfoSchema>) => {
    if (!authSession?.id) return;
    const res = await updateInfo(authSession.id, { name: values.name, dob: values.dob });
    if (res.status === 200) {
      toast.success({ title: "Success", message: "Info updated successfully" });
    } else {
      toast.error({ title: "Fail", message: res.message });
    }
  };

  return (
    <div className="mb-3">
      <h2 className="text-gray-800 text-xl font-semibold dark:text-gray-200">General Information</h2>
      <form
        id="infoForm"
        onSubmit={formInfo.handleSubmit(onSubmit)}
        className="w-full max-w-xs flex flex-col gap-4 mt-3"
      >
        <Controller
          name="email"
          control={formInfo.control}
          render={({ field, fieldState }) => (
            <TextField isRequired type="email" isInvalid={!!fieldState.error} isDisabled className="w-full" {...field}>
              <Label>Email</Label>
              <Input placeholder="your@email.com" />
            </TextField>
          )}
        />
        <Controller
          name="name"
          control={formInfo.control}
          render={({ field, fieldState }) => (
            <TextField isRequired type="text" isInvalid={!!fieldState.error} className="w-full" {...field}>
              <Label>Name</Label>
              <Input placeholder="Enter your name" />
            </TextField>
          )}
        />
        <Controller
          name="dob"
          control={formInfo.control}
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
        <Button type="submit" className="w-full bg-gray-900 text-white">
          Save
        </Button>
      </form>
    </div>
  );
};

export default InforForm;
