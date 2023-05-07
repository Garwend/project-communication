import { z, type ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { toastError } from "~/components/ui/toast";
import { api } from "~/utils/api";

type Props = {
  id: string;
  text: string;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormData = {
  text: string;
};

const schema: ZodType<FormData> = z.object({
  text: z.string().trim().min(1, { message: "To pole nie może być puste" }),
});

export default function EditAnswer({ id, text, open, onOpenChange }: Props) {
  const utils = api.useContext();

  const mutation = api.answers.edit.useMutation({
    onSuccess(data) {
      reset({ text: data.text });
      onOpenChange(false);
      void utils.answers.getAll.refetch(data.waitingForId);
    },
    onError() {
      toastError("nie udało się edytować odpowiedzi");
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
      text: text,
    },
  });

  const onSubmit = handleSubmit((data, e) => {
    e?.preventDefault();
    mutation.mutate({ id: id, text: data.text });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edytuj odpowiedź</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => void onSubmit(e)}>
          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Textarea
                id="description"
                className="h-60 resize-none"
                {...register("text")}
              />
              {errors.text && (
                <p className="text-sm text-destructive">
                  {errors.text?.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isLoading || !isDirty}>
              Edytuj
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
