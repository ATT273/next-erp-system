import { UserSignUp } from "@/types/requests/user.request";
import { signUp } from "../actions";
import useToast from "@/app/(app)/_hooks/use-toast";
import { useRouter } from "next/navigation";

export const useSignUpUser = async (data: UserSignUp) => {
  const { toast } = useToast();
  const router = useRouter();
  const res = await signUp({
    email: data.email,
    password: data.password,
    name: data.name,
  });

  if (!res.success) {
    toast.error({ title: "Error", message: res.errorMessage as string });
    // setError(res?.message ? res.message : "Unknown error");
    // router.replace("/");
  } else {
    toast.success({
      title: "Success",
      message: "Sign up successful",
    });
    router.replace("/dashboard");
    // setError("");
  }
};
