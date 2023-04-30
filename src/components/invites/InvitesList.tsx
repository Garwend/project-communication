import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import InviteItem from "./InviteItem";
import { api } from "~/utils/api";

export default function InvitesList() {
  const query = api.invites.getAll.useQuery();

  if (query.isLoading || query.error || query.data.length === 0) {
    return (
      <h4 className="select-none text-sm font-bold leading-none">Projekty</h4>
    );
  }

  return (
    <Popover>
      <PopoverTrigger className="inline-flex flex-row items-center">
        <h4 className="select-none text-sm font-bold leading-none">Projekty</h4>
        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          {query.data.length < 10 ? query.data.length : "9+"}
        </span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <ScrollArea className={query.data.length >= 2 ? "h-72 pr-4" : "h-48"}>
          {query.data.map((invite) => (
            <InviteItem
              key={invite.id}
              id={invite.id}
              name={invite.project.name}
              date={invite.createdAt}
            />
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
