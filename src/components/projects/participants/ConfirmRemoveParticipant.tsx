import { UserMinus } from "lucide-react";
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
  projectId: string;
  name?: string;
};

export default function ConfirmRemoveParticpant({
  id,
  name,
  projectId,
}: Props) {
  const utils = api.useContext();
  const mutation = api.projects.removeParticipant.useMutation({
    onSuccess() {
      void utils.projects.getById.refetch(projectId);
    },
    onError() {
      toastError("Nie udało się usunąć projektu");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm">
          <UserMinus className="mr-2 h-4 w-4" /> Usuń
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy jesteś pewny?</AlertDialogTitle>
          <AlertDialogDescription>
            Tej akcji nie da się cofnąć. <b>{name ?? "Użytkownik"}</b> zostanie
            usunięty z projektu.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              mutation.mutate({ userId: id, projectId: projectId })
            }
          >
            Usuń
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
