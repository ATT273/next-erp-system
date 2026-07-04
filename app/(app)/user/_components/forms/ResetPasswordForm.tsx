import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, TextField, Label, Input } from "@heroui/react";
import { IResetPasswordForm } from "@/types/user.type";

interface ResetPasswordFormProps {
  handleSubmit: (data: IResetPasswordForm) => void;
}

const ResetPasswordForm = ({ handleSubmit }: ResetPasswordFormProps) => {
  const formSchema = z.object({
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

  const form = useForm({
    mode: "onSubmit",
    defaultValues: { password: "" },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: IResetPasswordForm) => {
    handleSubmit(data);
    form.reset();
  };

  return (
    <form
      id="resetPasswordForm"
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-3 px-4 pt-4 overflow-y-auto"
    >
      <Card className="flex flex-col w-full gap-3 p-4" variant="transparent">
        <h3 className="text-lg font-semibold">Reset password</h3>
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <TextField
              isRequired
              type="password"
              isInvalid={fieldState.invalid}
              className="w-full"
              value={field.value}
              name={field.name}
              onChange={field.onChange}
            >
              <Label>New password</Label>
              <Input placeholder="Enter new password" />
            </TextField>
          )}
        />
      </Card>
    </form>
  );
};

export default ResetPasswordForm;
