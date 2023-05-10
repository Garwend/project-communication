import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getUserFirstLetters } from "~/lib/utils";
import { type RouterOutputs } from "~/utils/api";

type Task = RouterOutputs["tasks"]["getAll"][0];

type Props = {
  task: Task;
};

export default function Task({ task }: Props) {
  const { name, priority, dueDate, assignedTo } = task;

  return (
    <div className="cursor-pointer break-words rounded-lg border p-2 hover:border-primary">
      <p style={{ overflowWrap: "anywhere" }}>
        {priority === "NONE" ? null : (
          <span
            className={`mr-2 inline-block h-3 w-3 rounded-full ${
              priority === "LOW"
                ? "bg-green-600"
                : priority === "MID"
                ? "bg-yellow-600"
                : "bg-red-600"
            }`}
          ></span>
        )}
        {name}
      </p>
      <div className="mt-4 flex flex-row justify-between">
        {dueDate !== null ? (
          <div className="flex flex-row items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              {format(dueDate, "dd MMMM YYY", { locale: pl })}
            </span>
          </div>
        ) : null}

        <div className="h-0 w-0"></div>
        {assignedTo !== null ? (
          <Avatar className="h-6 w-6">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">
              {getUserFirstLetters(assignedTo.name ?? assignedTo.email ?? "")}
            </AvatarFallback>
          </Avatar>
        ) : null}
      </div>
    </div>
  );
}
