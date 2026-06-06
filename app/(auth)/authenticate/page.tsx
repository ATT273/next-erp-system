"use client";

import LogInForm from "./component/login-form";
import SignUpForm from "./component/signup-form";
import { Tabs } from "@heroui/react";

const Login = () => {
  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-3 p-3 absolute w-1/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white shadow-md rounded-md">
        <Tabs>
          <Tabs.ListContainer>
            <Tabs.List aria-label="authenticate">
              <Tabs.Tab id="log_in">
                Log In
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="sign_up">
                Sign Up
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel id="log_in">
            <LogInForm />
          </Tabs.Panel>
          <Tabs.Panel id="sign_up">
            <SignUpForm />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;
