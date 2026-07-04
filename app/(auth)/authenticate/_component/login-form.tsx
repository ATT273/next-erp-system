import React, { useState } from "react";
import { Button, TextField, Label, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn } from "../actions";
import { useForm, Controller } from "react-hook-form";

export type FormData = {
  email: string;
  password: string;
};

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "password must be at least 6 characters",
  }),
});

const initalForm = {
  email: "",
  password: "",
};

const LogInForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initalForm,
    mode: "onSubmit",
  });

  const onlogIn = async (values: z.infer<typeof formSchema>) => {
    const response = await signIn(values);
    if (response.status === 400) {
      setError(response.message);
    }
    if (response.status === 200) {
      localStorage.setItem("user", JSON.stringify(response));
      router.replace("/dashboard");
    }
  };

  return (
    <div className="h-[350px]">
      <form key="logInForm" onSubmit={form.handleSubmit(onlogIn)} className="flex flex-col gap-3 p-3 items-center">
        <h3 className="font-bold text-2xl text-center">Log In</h3>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField isRequired type="email" isInvalid={!!fieldState.error} className="w-full" {...field}>
              <Label>Email</Label>
              <Input placeholder="your@email.com" className="text-gray-900" />
            </TextField>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField isRequired type="password" isInvalid={!!fieldState.error} className="w-full" {...field}>
              <Label>Password</Label>
              <Input placeholder="Enter your password" />
            </TextField>
          )}
        />
        <p className="text-red-500">{error}</p>
        <Button type="submit" className="bg-slate-800 text-white w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

export default LogInForm;
