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
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DeleteComment({ id, open, onOpenChange }: Props) {
  const utils = api.useContext();

  const mutation = api.comments.delete.useMutation({
    onSuccess(data) {
      onOpenChange(false);
      void utils.comments.getAll.refetch(data.taskId);
    },
    onError() {
      toastError("Coś poszło nie tak podczas usuwania komentarza");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy jesteś pewny?</AlertDialogTitle>
          <AlertDialogDescription>
            Tej akcji nie da się cofnąć. Komentarz zostanie pernamentnie
            usunięta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate(id)}>
            Usuń komentarz
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
