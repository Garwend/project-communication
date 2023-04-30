import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { CheckCircle2, XCircle, Clock4 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";
import { toastError } from "~/components/ui/toast";
import { api } from "~/utils/api";

type Props = {
  id: string;
  name: string;
  date: Date;
};

export default function InviteItem({ id, name, date }: Props) {
  const utils = api.useContext();

  const mutation = api.invites.answerInvitation.useMutation({
    onSuccess(data) {
      void utils.invites.getAll.refetch();
      if (data.type === "ACCEPT") {
        void utils.projects.getAll.refetch();
      }
    },
    onError() {
      toastError("Wystąpił błąd");
    },
  });

  return (
    <Card className="mb-2">
      <CardHeader>
        <CardDescription>
          Zostałeś zaproszony do projektu <b>{name}</b>
        </CardDescription>
        <div className="inline-flex flex-row items-center gap-1 text-xs text-muted-foreground">
          <Clock4 className="inline-block h-3 w-3" />{" "}
          {formatDistance(date, new Date(), { locale: pl, addSuffix: true })}
        </div>
      </CardHeader>
      <CardFooter className="flex flex-row justify-between">
        <Button
          size="sm"
          onClick={() => mutation.mutate({ id: id, type: "ACCEPT" })}
          disabled={mutation.isLoading}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" /> Akceptuj
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => mutation.mutate({ id: id, type: "DECLINE" })}
          disabled={mutation.isLoading}
        >
          <XCircle className="mr-2 h-4 w-4" /> Odrzuć
        </Button>
      </CardFooter>
    </Card>
  );
}
