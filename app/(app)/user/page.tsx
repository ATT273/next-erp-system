import { getSession } from "@/app/actions";
import { redirect } from "next/navigation";
import Forbidden from "@/components/pages/forbidden";
import PageContent from "./_components/PageContent";
import { canAccess } from "@/utils/rbac.utils";

const User = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/authenticate");
  } else {
    const _canAccess = canAccess(session.permissions!, "user");
    if (!_canAccess || !session.roleActive) {
      return <Forbidden />;
    }
  }
  return (
    <div className="flex-1 p-3 h-dvh">
      <PageContent />
    </div>
  );
};

export default User;
