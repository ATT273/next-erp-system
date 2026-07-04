"use client";
import { Accordion, Separator } from "@heroui/react";
import { Lock } from "@/components/icons/lock";
import PasswordForm from "./PasswordForm";
import InforForm from "./InforForm";
import { useAuth } from "../../_providers/authProvider";

const PageContent = () => {
  const { authSession } = useAuth();

  return (
    <div>
      <title>Profile | CRM</title>
      <div className="w-1/3 p-3 h-dvh">
        <h1 className="mb-3 text-3xl font-bold">Profile</h1>
        <div>
          <InforForm />
          <Separator />
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
