import { useState } from "react";
import { z, type ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
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
  projectId: string;
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

export default function EditWaitingFor({ id, projectId }: Props) {
  const utils = api.useContext();
  const [open, setOpen] = useState(false);

  const mutation = api.waitingFor.update.useMutation({
    onSuccess(data) {
      setOpen(false);
      reset({ name: data.name, description: data.description ?? "" });
      void utils.projects.getById.refetch(projectId);
      void utils.waitingFor.getById.refetch(id);
    },
    onError() {
      toastError("Wystąpił błąd");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: utils.waitingFor.getById.getData(id)?.name,
      description: utils.waitingFor.getById.getData(id)?.description ?? "",
    },
  });

  const onSubmit = handleSubmit((data, e) => {
    e?.preventDefault();
    mutation.mutate({
      id: id,
      projectId: projectId,
      name: data.name,
      description: data.description,
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-7 w-7 p-0">
          <Edit className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edytuj rzecz na którą oczekujesz</DialogTitle>
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
                className="h-56 resize-none"
                {...register("description")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!isDirty}>
              Edytuj
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
