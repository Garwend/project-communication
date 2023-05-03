import { useState, useEffect } from "react";
import { z, type ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toastError } from "~/components/ui/toast";
import { api } from "~/utils/api";

type Props = {
  id: string;
};

type FormData = {
  name: string;
  description?: string;
};

const schema: ZodType<FormData> = z.object({
  name: z
    .string()
    .min(1, { message: "To pole nie może być puste" })
    .max(64, { message: "Maksymalna długość to 64 znaki" }),
  description: z.string(),
});

export default function CreateWaitingFor({ id }: Props) {
  const utils = api.useContext();
  const [open, setOpen] = useState(false);

  const mutation = api.waitingFor.create.useMutation({
    onSuccess() {
      setOpen(false);
      reset();
      void utils.projects.getById.refetch(id);
    },
    onError() {
      toastError("Wystąpił błąd");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data, e) => {
    e?.preventDefault();
    mutation.mutate({
      projectId: id,
      name: data.name,
      description: data.description,
    });
  });

  useEffect(() => {
    reset();
  }, [id, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-7 w-7 p-0">
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj rzecz na którą oczekujesz</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void onSubmit(e)}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Nazwa</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name?.message}
                </p>
              )}
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Opis</Label>
              <Textarea
                id="description"
                className="h-32 resize-none"
                {...register("description")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Dodaj</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
