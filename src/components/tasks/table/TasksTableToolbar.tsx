import { type Table } from "@tanstack/react-table";
import TaskTableFacetedFilter from "./TaskTableFacetedFilter";
import { api } from "~/utils/api";

interface TasksTableToolbarProps<TData> {
  table: Table<TData>;
}

const statuses = [
  { label: "Oczekiwanie", value: "WAITING" },
  { label: "Realizacja", value: "IN_PROGRESS" },
  { label: "Zrealizowane", value: "FINISHED" },
];

const priorities = [
  { label: "Brak", value: "NONE" },
  { label: "Niski", value: "LOW" },
  { label: "Średni", value: "MID" },
  { label: "Wysoki", value: "HIGH" },
];

export default function TasksTableToolbar<TData>({
  table,
}: TasksTableToolbarProps<TData>) {
  const utils = api.useContext();
  const projects = utils.projects.getAll.getData();
  api.projects.getAll.useQuery(undefined, { enabled: projects === undefined });

  return (
    <section className="mb-2 flex flex-row gap-2">
      {table.getColumn("projectId") && (
        <TaskTableFacetedFilter
          column={table.getColumn("projectId")}
          title="Projekt"
          options={
            projects
              ? projects.map((project) => ({
                  label: project.name,
                  value: project.id,
                }))
              : []
          }
          search={true}
        />
      )}
      {table.getColumn("status") && (
        <TaskTableFacetedFilter
          column={table.getColumn("status")}
          title="Status"
          options={statuses}
        />
      )}
      {table.getColumn("priority") && (
        <TaskTableFacetedFilter
          column={table.getColumn("priority")}
          title="Priorytet"
          options={priorities}
        />
      )}
    </section>
  );
}
