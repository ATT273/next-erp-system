"use client";

import LogInForm from "./component/login-form";
import SignUpForm from "./component/signup-form";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";

const Login = () => {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-3 p-3 absolute w-1/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded-md">
        <Tabs fullWidth aria-label="authenticate">
          <Tab key="log_in" title="Log In">
            <LogInForm />
          </Tab>
          <Tab key="sign_up" title="Sign Up">
            <SignUpForm />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
