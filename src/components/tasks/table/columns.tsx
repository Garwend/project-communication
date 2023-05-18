import { createColumnHelper } from "@tanstack/react-table";
import { SortAsc, SortDesc, ArrowDownUp } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { type RouterOutputs } from "~/utils/api";
import { UserCell, TaskStatusCell, TaskPriorityCell } from "./TaskTableCell";

type Task = RouterOutputs["tasks"]["getMyTasks"][0];

const columnHelper = createColumnHelper<Task>();

export const columns = [
  columnHelper.accessor("name", {
    header: (info) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8"
        onClick={() => {
          if (info.column.getIsSorted() === "desc") {
            info.column.clearSorting();
          } else {
            info.column.toggleSorting(info.column.getIsSorted() === "asc");
          }
        }}
      >
        <span>Nazwa</span>
        {info.column.getIsSorted() === "desc" ? (
          <SortDesc className="ml-2 h-4 w-4" />
        ) : info.column.getIsSorted() === "asc" ? (
          <SortAsc className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDownUp className="ml-2 h-4 w-4" />
        )}
      </Button>
    ),
    cell: (info) => (
      <p style={{ overflowWrap: "anywhere" }} className="font-medium">
        {info.getValue()}
      </p>
    ),
  }),
  columnHelper.accessor("projectId", {
    header: "Projekt",
    cell: (info) => (
      <div className="w-[180px]">
        <p style={{ overflowWrap: "anywhere" }}>
          {info.row.original.project.name}
        </p>
      </div>
    ),
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <TaskStatusCell status={info.getValue()} />,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  }),
  columnHelper.accessor("priority", {
    header: "Priorytet",
    cell: (info) => <TaskPriorityCell priority={info.getValue()} />,
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  }),
  columnHelper.accessor("assignedTo", {
    header: "Przypisane do",
    cell: (info) => {
      const assignedTo = info.getValue();

      if (!assignedTo) {
        return null;
      }

      return <UserCell name={assignedTo.name} email={assignedTo.email} />;
    },
  }),
  columnHelper.accessor("createdBy", {
    header: "Dodane przez",
    cell: (info) => {
      const createdBy = info.getValue();

      return <UserCell name={createdBy.name} email={createdBy.email} />;
    },
  }),
  columnHelper.accessor("dueDate", {
    header: (info) => (
      <div className="min-w-[145px] text-right">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8"
          onClick={() => {
            if (info.column.getIsSorted() === "desc") {
              info.column.clearSorting();
            } else {
              info.column.toggleSorting(info.column.getIsSorted() === "asc");
            }
          }}
        >
          <span>Termin</span>
          {info.column.getIsSorted() === "desc" ? (
            <SortDesc className="ml-2 h-4 w-4" />
          ) : info.column.getIsSorted() === "asc" ? (
            <SortAsc className="ml-2 h-4 w-4" />
          ) : (
            <ArrowDownUp className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
    ),
    cell: (info) => {
      const dueDate = info.getValue();

      return (
        <div className="text-right">
          {dueDate
            ? format(dueDate, "dd MMMM YYY", {
                locale: pl,
              })
            : ""}
        </div>
      );
    },
  }),
];
