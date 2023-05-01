import { useState, useEffect } from "react";
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
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toastError } from "~/components/ui/toast";
import { api } from "~/utils/api";

type Props = {
  id: string;
  stage: string;
};

type FormData = {
  stage: string;
};

const schema: ZodType<FormData> = z.object({
  stage: z.string().min(1, { message: "To pole nie może być puste" }),
});

export default function CreateProjectStage({ id, stage }: Props) {
  const utils = api.useContext();
  const [open, setOpen] = useState(false);

  const mutation = api.projectStages.createProjectStage.useMutation({
    onSuccess(data) {
      reset({ stage: data.stage });
      setOpen(false);
      void utils.projects.getById.refetch(id);
      void utils.projectStages.getAll.refetch(id);
    },
    onError() {
      toastError("nie udało się zaktualizować etapu projektu");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data, e) => {
    e?.preventDefault();
    mutation.mutate({ id: id, stage: data.stage });
  });

  useEffect(() => {
    reset({ stage: stage });
  }, [stage, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="mt-0 h-7 w-7 p-0"
          disabled={mutation.isLoading}
        >
          <Edit className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Zaktualizuj etap projektu</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void onSubmit(e)}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Etap</Label>
              <Textarea
                id="description"
                className="h-60 resize-none"
                {...register("stage")}
              />
              {errors.stage && (
                <p className="text-sm text-destructive">
                  {errors.stage?.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isLoading || !isDirty}>
              Zapisz
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
