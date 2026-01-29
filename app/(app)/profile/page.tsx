import PageContent from "./components/PageContent";
import { getSession } from "@/app/actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile",
  description: "Profile",
};

const Profile = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/authenticate");
  }

  return <PageContent />;
};

export default Profile;
