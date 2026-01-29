"use client";

import { z } from "zod";
import { updateInfo } from "../actions";
import { useEffect } from "react";
import { getLocalUser } from "@/utils/session";
import { getUserDetails } from "@/app/(app)/user/actions";
import { Form, Input, Button, DatePicker, CalendarDate } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { parseDate } from "@internationalized/date";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { I18nProvider } from "@react-aria/i18n";

const formInfoSchema = z.object({
  id: z.string(),
  email: z.string().email({
    message: "Invalid email address",
  }),
  name: z.string().min(6, {
    message: "Name must be at least 6 characters",
  }),
  dob: z.string(),
});

const InforForm = () => {
  const formInfo = useForm({
    defaultValues: {
      id: "",
      email: "",
      name: "",
      dob: "",
    },
    mode: "onChange",
    resolver: zodResolver(formInfoSchema),
  });
  useEffect(() => {
    const _localUser = getLocalUser();
    if (_localUser.data.id) {
      getDetail(_localUser.data.id);
    }
  }, []);

  const getDetail = async (id: string) => {
    const res = await getUserDetails(id);
    if (res.status === 200) {
      formInfo.reset({
        id: res.data.id,
        email: res.data.email,
        name: res.data.name,
        dob: res.data.dob,
      });
    }
  };
  const onSubmit = async (values: z.infer<typeof formInfoSchema>) => {
    const res = await updateInfo(values.email, values.name, values.dob, values.id);
    if (res.status === 200) {
      addToast({
        title: "Success",
        description: "Info updated successfully",
        color: "success",
      });
    }
  };
  return (
    <div className="mb-3">
      <h2 className="text-gray-800 text-xl font-semibold">General Information</h2>
      <Form className="w-full max-w-xs flex flex-col gap-4" onSubmit={formInfo.handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={formInfo.control}
          render={({ field }) => (
            <Input
              isRequired
              label="Email"
              type="email"
              placeholder="your@email.com"
              className="w-full"
              value={field.value}
              name={field.name}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="name"
          control={formInfo.control}
          render={({ field }) => (
            <Input
              isRequired
              label="Name"
              type="text"
              placeholder="Enter your name"
              value={field.value}
              name={field.name}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          name="dob"
          control={formInfo.control}
          render={({ field }) => (
            <I18nProvider locale="en-GB">
              <DatePicker
                className="w-full"
                label="Date of Birth"
                value={field.value ? (parseDate(field.value) as unknown as CalendarDate) : null}
                onChange={field.onChange}
              />
            </I18nProvider>
          )}
        />
        <div className="flex justify-end w-full">
          <Button type="submit" variant="light" className="w-full bg-gray-900 text-white">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default InforForm;
