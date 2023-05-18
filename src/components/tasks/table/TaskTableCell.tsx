import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { getUserFirstLetters } from "~/lib/utils";

import { type RouterOutputs } from "~/utils/api";
type Status = RouterOutputs["tasks"]["getMyTasks"][0]["status"];
type Priority = RouterOutputs["tasks"]["getMyTasks"][0]["priority"];

type UserCellProps = {
  name?: string | null;
  email?: string | null;
};

export function UserCell({ name, email }: UserCellProps) {
  return (
    <>
      {name || email ? (
        <div className="flex items-center space-x-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">
              {getUserFirstLetters(name ?? email ?? "")}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[125px] truncate">{name ?? email ?? ""}</span>
        </div>
      ) : null}
    </>
  );
}

type StatusCellProps = {
  status: Status;
};

export function TaskStatusCell({ status }: StatusCellProps) {
  return (
    <Badge variant="secondary">
      {status === "WAITING"
        ? "Oczekiwanie"
        : status === "IN_PROGRESS"
        ? "Realizacja"
        : "Zrealizowane"}
    </Badge>
  );
}

type PriorityCellProps = {
  priority: Priority;
};

export function TaskPriorityCell({ priority }: PriorityCellProps) {
  return (
    <>
      {priority === "NONE" ? null : (
        <Badge variant="secondary">
          {priority === "LOW" ? (
            <>
              <span className="mr-1 inline-block h-3 w-3 rounded-full bg-green-600"></span>
              <span>Niski</span>
            </>
          ) : priority === "MID" ? (
            <>
              <span className="mr-1 inline-block h-3 w-3 rounded-full bg-yellow-600"></span>
              <span>Średni</span>
            </>
          ) : (
            <>
              <span className="mr-1 inline-block h-3 w-3 rounded-full bg-red-600"></span>
              <span>Wysoki</span>
            </>
          )}
        </Badge>
      )}
    </>
  );
}
