"use client";
import { Accordion, AccordionItem, Divider } from "@heroui/react";
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
          <Accordion defaultValue="">
            <AccordionItem
              key="password"
              aria-label="Password"
              startContent={<Lock className="size-6" />}
              title="Change Password"
            >
              <PasswordForm />
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default PageContent;
