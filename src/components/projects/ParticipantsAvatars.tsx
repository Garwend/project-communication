import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getUserFirstLetters } from "~/lib/utils";
import { api } from "~/utils/api";

type Props = {
  id: string;
};

export default function ParticipantsAvatarts({ id }: Props) {
  const utils = api.useContext();
  const owner = utils.projects.getById.getData(id)?.owner;
  const participants = utils.projects.getById.getData(id)?.participants;

  return (
    <div className="flex flex-row -space-x-3">
      <Avatar className="z-[1] h-9 w-9 cursor-pointer border border-background hover:z-10">
        <AvatarImage src="" />
        <AvatarFallback>
          {getUserFirstLetters(owner?.name ?? owner?.email ?? "")}
        </AvatarFallback>
      </Avatar>
      {participants?.slice(0, 2).map((participant) => (
        <Avatar
          key={participant.user.id}
          className="z-[1] h-9 w-9 cursor-pointer border border-background hover:z-10"
        >
          <AvatarImage src="" />
          <AvatarFallback>
            {getUserFirstLetters(
              participant.user.email ?? participant.user.email ?? ""
            )}
          </AvatarFallback>
        </Avatar>
      ))}
      {participants !== undefined && participants.length - 2 > 0 ? (
        <Avatar className="z-[1] h-9 w-9 cursor-pointer border border-background hover:z-10">
          <AvatarImage src="" />
          <AvatarFallback>
            {participants.length - 2 > 9 ? "9+" : participants.length - 2}
          </AvatarFallback>
        </Avatar>
      ) : null}
    </div>
  );
}
