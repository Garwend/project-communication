import { useState } from "react";
import { z, type ZodType } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toastError } from "~/components/ui/toast";
// import { Switch } from "~/components/ui/switch";
import { api } from "~/utils/api";

type Props = {
  id: string;
};

type FormData = {
  name: string;
  description?: string;
  // asanaIntegration: boolean;
  // asanaEmail?: string;
};

const schema: ZodType<FormData> = z.object({
  name: z
    .string()
    .min(1, { message: "To pole nie może być puste" })
    .max(64, { message: "Maksymalna długość to 64 znaki" }),
  description: z.string(),
  // asanaIntegration: z.boolean(),
  // asanaEmail: z
  //   .string()
  //   .email({ message: "Niepoprawny adres email" })
  //   .optional()
  //   .or(z.literal("")),
});

export default function EditProject({ id }: Props) {
  const utils = api.useContext();
  const [open, setOpen] = useState(false);

  const mutation = api.projects.editProject.useMutation({
    onSuccess(data) {
      reset({
        name: data.name,
        description: data.description ?? "",
        // asanaEmail: data.asanaEmail ?? "",
        // asanaIntegration: data.asanaIntegration,
      });
      void utils.projects.getById.refetch(id);
      void utils.projects.getAll.refetch();
      setOpen(false);
    },
    onError() {
      toastError("nie udało się edytować projektu");
    },
  });

  const {
    // watch,
    register,
    handleSubmit,
    reset,
    // control,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: utils.projects.getById.getData(id)?.name,
      description: utils.projects.getById.getData(id)?.description ?? "",
      // asanaIntegration: utils.projects.getById.getData(id)?.asanaIntegration,
      // asanaEmail: utils.projects.getById.getData(id)?.asanaEmail ?? "",
    },
  });

  // const watchAsanaIntegration = watch("asanaIntegration");

  const onSubmit = handleSubmit((data, e) => {
    e?.preventDefault();
    mutation.mutate({
      id: id,
      name: data.name,
      description: data.description,
      // asanaIntegration: data.asanaIntegration,
      // asanaEmail: data.asanaEmail,
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Edytuj</span>
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edytuj projekt</DialogTitle>
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
            {/* <div className="flex items-center space-x-2">
              <Controller
                name="asanaIntegration"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="asanaIntegration"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="asanaIntegration">Asana</Label>
            </div>
            {watchAsanaIntegration ? (
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="asanaEmail">Asana email</Label>
                <Input id="asanaEmail" {...register("asanaEmail")} />
                {errors.asanaEmail && (
                  <p className="text-sm text-destructive">
                    {errors.asanaEmail?.message}
                  </p>
                )}
              </div>
            ) : null} */}
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
            <Button type="submit" disabled={mutation.isLoading || !isDirty}>
              Edytuj
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
