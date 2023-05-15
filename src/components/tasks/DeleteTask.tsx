import { useRouter } from "next/router";
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
  projectId: string;
};

export default function DeleteTask({ id, projectId }: Props) {
  const router = useRouter();
  const utils = api.useContext();
  const mutation = api.tasks.delete.useMutation({
    onSuccess(data) {
      void utils.tasks.getAll.refetch({
        projectId: projectId,
        status: data.status,
      });
      void utils.projects.getById.invalidate(projectId);
      void router.push(`/projects/${projectId}`);
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
            Tej akcji nie da się cofnąć. Zadanie zostanie pernamentnie usunięte.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              mutation.mutate({
                id: id,
                projectId: projectId,
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
