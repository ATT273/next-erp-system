"use client";

import { ISession } from "@/types/auth.types";
import { Link, Button } from "@heroui/react";

interface HomePageActionProps {
  session: ISession | null;
}
const HomePageAction = ({ session }: HomePageActionProps) => {
  return (
    <div>
      {session && session.id ? (
        <Button variant="outline">
          <Link href="/dashboard" className={"no-underline"}>
            Go to dashboard
          </Link>
        </Button>
      ) : (
        <Button variant="outline">
          <Link href="/authenticate" className={"no-underline"}>
            Login
          </Link>
        </Button>
      )}
    </div>
  );
};

export default HomePageAction;
