import React, { useState } from "react";
import { Button, TextField, Label, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signUp } from "../actions";

export type FormData = {
  name: string;
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
  name: z.string().min(6, {
    message: "name must be at least 6 characters",
  }),
});

const initalForm = {
  email: "",
  password: "",
  name: "",
};

const SignUpForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const onSignUp = async (values: z.infer<typeof formSchema>) => {
    const result = await signUp(values);
    console.log("result done signup", result);
  };

  const form = useForm({
    mode: "onSubmit",
    defaultValues: initalForm,
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="h-[350px]">
      <form key="signUpForm" onSubmit={form.handleSubmit(onSignUp)} className="flex flex-col items-center gap-3 p-3">
        <h3 className="text-2xl font-bold text-center">Sign Up</h3>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField isRequired isInvalid={!!fieldState.error} className="w-full" {...field}>
              <Label>Name</Label>
              <Input placeholder="Enter your name" />
            </TextField>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField isRequired type="email" isInvalid={!!fieldState.error} className="w-full" {...field}>
              <Label>Email</Label>
              <Input placeholder="your@email.com" />
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
        <Button type="submit" className="w-full text-white bg-slate-800">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
