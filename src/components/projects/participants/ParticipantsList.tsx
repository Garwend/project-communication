import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/utils/api";

import ParticipantsAvatars from "./ParticipantsAvatars";
import ParticipantItem from "./ParticipantItem";

type Props = {
  id: string;
};

export default function ParticipantsList({ id }: Props) {
  const utils = api.useContext();
  const { data: session } = useSession();
  const owner = utils.projects.getById.getData(id)?.owner;
  const participants = utils.projects.getById.getData(id)?.participants;

  return (
    <Dialog>
      <DialogTrigger>
        <ParticipantsAvatars id={id} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Uczestnicy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="pr-4">
          <div className="max-h-80">
            <ParticipantItem
              id={owner?.id ?? ""}
              projectId={id}
              name={owner?.name ?? undefined}
              email={owner?.email ?? ""}
              allowRemove={false}
            />
            {participants?.map((participant) => (
              <ParticipantItem
                key={participant.user.id}
                id={participant.user.id}
                projectId={id}
                name={participant.user.name ?? undefined}
                email={participant.user.email ?? ""}
                allowRemove={session?.user.id === owner?.id}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
