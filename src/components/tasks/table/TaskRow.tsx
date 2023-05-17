import { useRouter } from "next/router";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { TableCell, TableRow } from "~/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { getUserFirstLetters } from "~/lib/utils";

import { type RouterOutputs } from "~/utils/api";

type Task = RouterOutputs["tasks"]["getMyTasks"][0];

type Props = {
  task: Task;
};

export default function TaskRow({ task }: Props) {
  const router = useRouter();

  const openTask = async () => {
    await router.push(`/?taskId=${task.id}`, `/tasks/${task.id}`, {
      shallow: true,
    });
  };

  return (
    <TableRow onClick={() => void openTask()} className="cursor-pointer">
      <TableCell className="font-medium">
        <p style={{ overflowWrap: "anywhere" }}>{task.name}</p>
      </TableCell>
      <TableCell className="font-medium">
        <p style={{ overflowWrap: "anywhere" }}>{task.project.name}</p>
      </TableCell>
      <TaskStatusCell task={task} />
      <TaskPriorityCell task={task} />
      <UserCell name={task.assignedTo?.name} email={task.assignedTo?.email} />
      <UserCell name={task.createdBy?.name} email={task.createdBy?.email} />
      <TableCell className="text-right">
        {task.dueDate
          ? format(task.dueDate, "dd MMMM YYY", {
              locale: pl,
            })
          : ""}
      </TableCell>
    </TableRow>
  );
}

type UserCellProps = {
  name?: string | null;
  email?: string | null;
};

export function UserCell({ name, email }: UserCellProps) {
  return (
    <TableCell>
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
    </TableCell>
  );
}

function TaskStatusCell({ task }: Props) {
  return (
    <TableCell>
      <Badge variant="secondary">
        {task.status === "WAITING"
          ? "Oczekiwanie"
          : task.status === "IN_PROGRESS"
          ? "Realizacja"
          : "Zrealizowane"}
      </Badge>
    </TableCell>
  );
}

function TaskPriorityCell({ task }: Props) {
  return (
    <TableCell>
      {task.priority === "NONE" ? null : (
        <Badge variant="secondary">
          {task.priority === "LOW" ? (
            <>
              <span className="mr-1 inline-block h-3 w-3 rounded-full bg-green-600"></span>
              <span>Niski</span>
            </>
          ) : task.priority === "MID" ? (
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
    </TableCell>
  );
}
