import { useState } from "react";
import { z, type ZodType } from "zod";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, CalendarIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toastError } from "~/components/ui/toast";
import { cn, getUserFirstLetters } from "~/lib/utils";
import { api, type RouterOutputs } from "~/utils/api";

type Props = {
  projectId: string;
  task: Task;
  fetchProject: boolean;
};

type Task = RouterOutputs["tasks"]["getById"];
type Priority = RouterOutputs["tasks"]["create"]["priority"];

type FormData = {
  name: string;
  description?: string;
  priority: Priority;
  assignedToId?: string;
  dueDate?: Date;
};

const schema: ZodType<FormData> = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "To pole nie może być puste" })
    .max(100, { message: "Maksymalna długość to 100 znaków" }),
  description: z.string().optional(),
  priority: z.enum(["NONE", "LOW", "MID", "HIGH"]),
  assignedToId: z.string().optional(),
  dueDate: z.date().optional(),
});

export default function EditTask({ projectId, task, fetchProject }: Props) {
  const utils = api.useContext();
  api.projects.getById.useQuery(projectId, {
    retry: false,
    enabled: fetchProject,
  });
  const participants = utils.projects.getById.getData(projectId)?.participants;
  const owner = utils.projects.getById.getData(projectId)?.owner;
  const [open, setOpen] = useState(false);

  const mutation = api.tasks.edit.useMutation({
    onSuccess(data) {
      reset({
        name: data.name,
        description: task.description ?? "",
        dueDate: data.dueDate ?? undefined,
        priority: data.priority,
        assignedToId: data.assignedToId ?? "",
      });
      setOpen(false);
      void utils.tasks.getById.refetch(task.id);
      void utils.tasks.getAll.refetch({
        projectId: projectId,
        status: data.status,
      });
    },
    onError() {
      toastError("nie udało się dodać zadania");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: task.name,
      description: task.description ?? "",
      dueDate: task.dueDate ?? undefined,
      priority: task.priority,
      assignedToId: task.assignedToId ?? "",
    },
  });

  const onSubmit = handleSubmit((data, e) => {
    e?.preventDefault();
    mutation.mutate({
      ...data,
      projectId: projectId,
      id: task.id,
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-7 w-7 p-0">
          <Edit className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-full lg:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Edytuj zadanie</DialogTitle>
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
            <div className="flex flex-row justify-between">
              <div className="grid items-center gap-1.5">
                <Label>Priorytet</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[190px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">Brak</SelectItem>
                        <SelectItem value="LOW">
                          <span className="mr-1 inline-block h-3 w-3 rounded-full bg-green-600"></span>
                          <span>Niski</span>
                        </SelectItem>
                        <SelectItem value="MID">
                          <span className="mr-1 inline-block h-3 w-3 rounded-full bg-yellow-600"></span>
                          <span>Średni</span>
                        </SelectItem>
                        <SelectItem value="HIGH">
                          <span className="mr-1 inline-block h-3 w-3 rounded-full bg-red-600"></span>
                          <span>Wysoki</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid items-center gap-1.5">
                <Label>Przypisane do</Label>
                <Controller
                  name="assignedToId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-[190px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">
                          <span>Wybierz</span>
                        </SelectItem>
                        <SelectItem value={owner?.id ?? ""}>
                          <div className="flex flex-row items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="" />
                              <AvatarFallback className="text-xs">
                                {getUserFirstLetters(
                                  owner?.name ?? owner?.email ?? ""
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <span className="max-w-[115px] truncate">
                              {owner?.name ?? owner?.email}
                            </span>
                          </div>
                        </SelectItem>
                        {participants?.map((participant) => (
                          <SelectItem
                            key={participant.user.id}
                            value={participant.user.id}
                          >
                            <div className="flex flex-row items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src="" />
                                <AvatarFallback className="text-xs">
                                  {getUserFirstLetters(
                                    participant.user.name ??
                                      participant.user.email ??
                                      ""
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <span className="max-w-[115px] truncate">
                                {participant.user.name ??
                                  participant.user.email}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="grid items-center gap-1.5">
                <Label>Termin wykonania</Label>
                <Controller
                  name="dueDate"
                  control={control}
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[190px] justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP", { locale: pl })
                          ) : (
                            <span>Wybierz date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          locale={pl}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />
              </div>
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
