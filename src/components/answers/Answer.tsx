import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getUserFirstLetters } from "~/lib/utils";

type Props = {
  name: string;
  text: string;
  date: Date;
};

export default function Answer({ name, text, date }: Props) {
  return (
    <div className="mt-4">
      <section className="flex flex-row">
        <div className="flex flex-row items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>{getUserFirstLetters(name)}</AvatarFallback>
          </Avatar>
          <small className="text-sm font-medium leading-none">{name}</small>
          <p className="text-sm text-muted-foreground">
            {formatDistance(date, new Date(), { locale: pl, addSuffix: true })}
          </p>
        </div>
      </section>
      <p className="mt-2">{text}</p>
    </div>
  );
}
