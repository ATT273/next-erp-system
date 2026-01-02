import React, { useState } from "react";
import { Button } from "@heroui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@heroui/input";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signUp } from "../actions";
type Inputs = {
  example: string;
  exampleRequired: string;
};

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
    try {
      const res = await signUp({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (res.status === 400) {
        setError(res?.message ? res.message : "Unknown error");
        router.replace("/");
      } else {
        router.replace("/dashboard");
        setError("");
      }
    } catch (error) {
      console.log("error siginn", error);
    }
  };

  const form = useForm({
    mode: "onSubmit",
    defaultValues: initalForm,
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="h-[350px]">
      <form key="signUpForm" onSubmit={form.handleSubmit(onSignUp)} className="flex flex-col gap-3 p-3 items-center">
        <h3 className="font-bold text-2xl text-center">Sign Up</h3>
        <Controller
          name="name"
          control={form.control}
          render={({ field }) => (
            <Input isRequired label="Name" placeholder="Enter your name" className="w-full" {...field} />
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <Input isRequired label="Email" placeholder="your@email.com" className="w-full" {...field} />
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field }) => (
            <Input
              isRequired
              label="Password"
              type="password"
              placeholder="Enter your password"
              className="w-full"
              {...field}
            />
          )}
        />
        <p className="text-red-500">{error}</p>
        <Button type="submit" className="bg-slate-800 text-white w-full">
          Sign Up
        </Button>
      </form>
    </div>
  );
};

export default SignUpForm;
