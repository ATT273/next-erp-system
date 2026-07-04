"use client";
import { useRef, useMemo } from "react";
import { Button } from "@heroui/react";
import { useAuth } from "@/app/(app)/_providers/authProvider";
import { canEdit } from "@/utils/rbac.utils";
import RoleDialog, { RoleDialogRef } from "../new-role-dialog";

const NewRoleDialogTrigger = () => {
  const ref = useRef<RoleDialogRef>(null);
  const { authSession } = useAuth();

  const _canEdit = useMemo(() => {
    if (!authSession?.permissions) return false;
    return canEdit(authSession.permissions, "role");
  }, [authSession?.permissions]);

  return (
    <>
      <RoleDialog ref={ref} />
      <Button
        variant="outline"
        onPress={() => ref.current?.handleOpen()}
        isDisabled={!_canEdit}
        className="font-semibold hover:bg-emerald-500 hover:text-white"
      >
        Add new role
      </Button>
    </>
  );
};

export default NewRoleDialogTrigger;
