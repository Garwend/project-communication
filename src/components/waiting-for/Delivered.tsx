import { CheckSquare } from "lucide-react";
import { Toggle } from "~/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { toastError } from "~/components/ui/toast";

import { api } from "~/utils/api";

type Props = {
  id: string;
  projectId: string;
  delivered: boolean;
};

export default function Delivered({ id, projectId, delivered }: Props) {
  const utils = api.useContext();

  const mutation = api.waitingFor.markedAsDelivered.useMutation({
    onSuccess() {
      void utils.projects.getById.refetch(projectId);
      void utils.waitingFor.getById.refetch(id);
    },
    onError() {
      toastError("Wystąpił błąd");
    },
  });

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            aria-label="Toggle delivered"
            className={`h-7 w-7 p-0 ${
              delivered
                ? "data-[state=on]:bg-transparent data-[state=on]:hover:bg-accent"
                : "text-muted-foreground"
            }`}
            pressed={delivered}
            onPressedChange={(pressed) => {
              mutation.mutate({
                id: id,
                projectId: projectId,
                delivered: pressed,
              });
            }}
          >
            <CheckSquare className="h-5 w-5" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom" hideWhenDetached={true}>
          <p>
            {delivered ? "Oznacz jak niedostarczone" : "Oznacz jak dostarczone"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
