"use client";

import LogInForm from "./_component/login-form";
import SignUpForm from "./_component/signup-form";
import { Tabs } from "@heroui/react";

const Login = () => {
  return (
    <div className="w-full h-full">
      <div className="absolute flex flex-col w-1/4 gap-3 p-3 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-md top-1/2 left-1/2">
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
