import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { toastError } from "~/components/ui/toast";
import { api } from "~/utils/api";

type Props = {
  id: string;
  projectId: string;
  name: string;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  waitingForId?: string;
  taskId?: string;
};

export default function DeleteFile({
  id,
  projectId,
  name,
  open,
  onOpenChange,
  waitingForId,
  taskId,
}: Props) {
  const utils = api.useContext();

  const mutation = api.files.delete.useMutation({
    onSuccess() {
      onOpenChange(false);
      void utils.projects.getById.refetch(projectId);
      if (waitingForId !== undefined) {
        void utils.waitingFor.getById.refetch(waitingForId);
      }
      if (taskId !== undefined) {
        void utils.tasks.getById.refetch(taskId);
      }
    },
    onError() {
      toastError("Coś poszło nie tak podczas usuwania pliku");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy jesteś pewny?</AlertDialogTitle>
          <AlertDialogDescription>
            Tej akcji nie da się cofnąć. Plik <b>{name}</b> zostanie
            pernamentnie usunięty.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutation.mutate({ id: id, projectId: projectId })}
          >
            Usuń plik
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
