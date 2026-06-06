"use client";
import { Accordion, Divider } from "@heroui/react";
import { Lock } from "@/components/icons/lock";
import PasswordForm from "./PasswordForm";
import InforForm from "./InforForm";
import { useAuth } from "../../_providers/authProvider";

const PageContent = () => {
  const { authSession } = useAuth();

  return (
    <div>
      <title>Profile | CRM</title>
      <div className="h-dvh p-3 w-1/3">
        <h1 className="font-bold text-3xl mb-3">Profile</h1>
        <div>
          <InforForm />
          <Divider />
          <Accordion>
            <Accordion.Item id="password">
              <Accordion.Heading>
                <Accordion.Trigger>
                  <Lock className="size-6" />
                  Change Password
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <PasswordForm />
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default PageContent;
