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

export default function DeleteMessage({ id, open, onOpenChange }: Props) {
  const mutation = api.chat.deleteMessage.useMutation({
    onSuccess() {
      onOpenChange(false);
    },
    onError() {
      toastError("Coś poszło nie tak podczas usuwania wiadomości");
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Czy jesteś pewny?</AlertDialogTitle>
          <AlertDialogDescription>
            Tej akcji nie da się cofnąć. Wiadomość zostanie pernamentnie
            usunięta.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate(id)}>
            Usuń Wiadomość
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
