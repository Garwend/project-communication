import { useState } from "react";
import { z, type ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { toastError, toastSuccess } from "~/components/ui/toast";
import { api } from "~/utils/api";

type Props = {
  id: string;
  ownerId: string;
};

type FormData = {
  email: string;
};

const schema: ZodType<FormData> = z.object({
  email: z
    .string()
    .min(1, { message: "To pole nie może być puste" })
    .email({ message: "Niepoprawny adres email" }),
});

export default function InviteUser({ id, ownerId }: Props) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const mutation = api.invites.createInvite.useMutation({
    onSuccess() {
      reset();
      toastSuccess("Zaproszenie zostało wysłane");
    },
    onError(error) {
      console.log(error.message);
      if (
        error.data?.code === "BAD_REQUEST" ||
        error.data?.code === "NOT_FOUND"
      ) {
        setError("email", { type: "server", message: error.message });
      } else {
        toastError("Nie udało się wysłać zaproszenia");
      }
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data, e) => {
    e?.preventDefault();
    mutation.mutate({ email: data.email, projectId: id });
  });

  if (session?.user.id !== ownerId) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" /> Zaproś
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Zaproś do projektu</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void onSubmit(e)} className="grid gap-4">
          <div className="grid w-full items-center gap-1.5 py-4">
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email?.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isLoading}>
              Zaproś
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
