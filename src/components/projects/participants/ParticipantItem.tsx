import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getUserFirstLetters } from "~/lib/utils";
import ConfirmRemoveParticpant from "./ConfirmRemoveParticipant";

type Props = {
  id: string;
  projectId: string;
  name?: string;
  email: string;
  allowRemove: boolean;
};

export default function ParticipantItem({
  id,
  projectId,
  name,
  email,
  allowRemove,
}: Props) {
  return (
    <div className="mb-4 flex flex-row items-center justify-between">
      <section className="flex flex-row items-center gap-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src="" />
          <AvatarFallback>{getUserFirstLetters(name ?? email)}</AvatarFallback>
        </Avatar>
        <section>
          <small className="text-sm font-medium leading-none">{name}</small>
          <p className="text-sm text-muted-foreground">{email}</p>
        </section>
      </section>
      {allowRemove ? (
        <ConfirmRemoveParticpant id={id} name={name} projectId={projectId} />
      ) : null}
    </div>
  );
}
