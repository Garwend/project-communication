import { Trash2 } from "lucide-react";
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

export default function DeleteProject({ id }: Props) {
  const router = useRouter();
  const utils = api.useContext();
  const mutation = api.projects.deleteProject.useMutation({
    onSuccess() {
      void router.push("/");
      void utils.projects.getAll.refetch();
    },
    onError() {
      toastError("Nie udało się usunąć projektu");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={(event) => event.preventDefault()}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Usuń</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy jesteś pewny?</AlertDialogTitle>
          <AlertDialogDescription>
            Tej akcji nie da się cofnąć. Projekt{" "}
            <b>{utils.projects.getById.getData(id)?.name}</b> zostanie
            pernamentnie usunięty.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate(id)}>
            Usuń projekt
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
