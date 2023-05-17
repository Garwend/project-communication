import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import TaskRow from "./TaskRow";

import { api } from "~/utils/api";

export default function TasksTable() {
  const query = api.tasks.getMyTasks.useQuery();

  if (query.error || query.isLoading) {
    return null;
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="sticky top-0 z-50 bg-background">
              Nazwa
            </TableHead>
            <TableHead className="sticky top-0 z-50 w-[250px] bg-background">
              Projekt
            </TableHead>
            <TableHead className="sticky top-0 z-50 w-[125px] bg-background">
              Status
            </TableHead>
            <TableHead className="sticky top-0 z-50 w-[125px] bg-background">
              Priorytet
            </TableHead>
            <TableHead className="sticky top-0 z-50 w-[125px] bg-background">
              Przypisane do
            </TableHead>
            <TableHead className="sticky top-0 z-50 w-[125px] bg-background">
              Dodane przez
            </TableHead>
            <TableHead className="sticky top-0 z-50 w-[180px] bg-background text-right">
              Termin
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {query.data.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
