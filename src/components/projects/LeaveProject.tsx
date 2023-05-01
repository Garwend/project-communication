import { DoorOpen } from "lucide-react";
import { useRouter } from "next/router";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { toastError } from "~/components/ui/toast";
import { api } from "~/utils/api";

type Props = {
  id: string;
};

export default function LeaveProject({ id }: Props) {
  const router = useRouter();
  const utils = api.useContext();
  const mutation = api.projects.leaveProject.useMutation({
    onSuccess() {
      void router.push("/");
      void utils.projects.getAll.refetch();
    },
    onError() {
      toastError("Nie udało się opuścić projektu");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={(event) => event.preventDefault()}
        >
          <DoorOpen className="mr-2 h-4 w-4" />
          <span>Opuść</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy jesteś pewny?</AlertDialogTitle>
          <AlertDialogDescription>
            Tej akcji nie da się cofnąć. Opuścisz projekt{" "}
            <b>{utils.projects.getById.getData(id)?.name}</b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate(id)}>
            Opuść projekt
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
