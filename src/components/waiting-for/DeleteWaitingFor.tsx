import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
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

export default function DeleteWaitingFor({ id }: Props) {
  const utils = api.useContext();
  const waitingFor = utils.waitingFor.getById.getData(id);
  const mutation = api.waitingFor.delete.useMutation({
    onSuccess() {
      void utils.projects.getById.refetch(waitingFor?.projectId ?? "");
    },
    onError() {
      toastError("Nie udało się usunąć");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy jesteś pewny?</AlertDialogTitle>
          <AlertDialogDescription>
            Tej akcji nie da się cofnąć. Oczekiwanie na{" "}
            <b>{waitingFor?.name}</b> zostanie pernamentnie usunięte.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              mutation.mutate({
                id: id,
                projectId: waitingFor?.projectId ?? "",
              })
            }
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
