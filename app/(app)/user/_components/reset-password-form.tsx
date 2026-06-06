import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, TextField, Label, Input, Form } from "@heroui/react";
import { IResetPasswordForm } from "@/types/user.type";

interface ResetPasswordFormProps {
  setOpen: (open: boolean) => void;
  handleSubmit: (data: IResetPasswordForm) => void;
}

const ResetPasswordForm = ({ setOpen, handleSubmit }: ResetPasswordFormProps) => {
  const formSchema = z.object({
    password: z.string().min(6, { message: "password must be at least 6 characters" }),
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
    <Form className="flex flex-col gap-3 items-center h-[calc(100%-60px)] overflow-y-auto" onSubmit={form.handleSubmit(onSubmit)}>
      <Card className="w-full flex flex-col gap-3 p-4 shadow-sm">
        <Card.Content>
          <h3 className="text-lg font-semibold mb-3">Reset password</h3>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <TextField isRequired type="password" isInvalid={fieldState.invalid} className="w-full" value={field.value} name={field.name} onChange={field.onChange}>
                <Label>New password</Label>
                <Input placeholder="Enter your new password" />
              </TextField>
            )}
          />
        </Card.Content>
      </Card>
      <footer className="sticky bottom-0 left-0 w-full flex justify-end gap-1 py-2 px-4 bg-white">
        <Button onPress={() => { form.reset(); setOpen(false); }}>Close</Button>
        <Button type="submit" className="bg-emerald-500 text-white">Save</Button>
      </footer>
    </Form>
  );
};

export default ResetPasswordForm;
