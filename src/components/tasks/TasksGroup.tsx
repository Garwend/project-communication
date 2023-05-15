import { useDroppable } from "@dnd-kit/core";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableTask } from "./Task";

import { api, type RouterOutputs } from "~/utils/api";

type Status = RouterOutputs["tasks"]["getAll"][0]["status"];
type Project = RouterOutputs["projects"]["getById"];

type Props = {
  id: string;
  title: string;
  status: Status;
  projectData: Project;
  disabled: boolean;
};

export default function TasksGroup({
  id,
  title,
  status,
  projectData,
  disabled,
}: Props) {
  const query = api.tasks.getAll.useQuery({ projectId: id, status: status });

  const { setNodeRef } = useDroppable({
    id: status,
  });

  const tasksOrder =
    status === "FINISHED"
      ? projectData.FINISHED_ORDER
      : status === "IN_PROGRESS"
      ? projectData.IN_PROGRESS_ORDER
      : projectData.WAITING_ORDER;

  return (
    <section className="flex w-72 flex-col rounded-lg border py-2">
      <header className="flex flex-shrink-0 flex-row items-center justify-between px-2">
        <h4 className="text-xl font-semibold tracking-tight">{title}</h4>
      </header>
      <div className="px-2">
        <Separator className="my-2 flex-shrink-0" />
      </div>
      <SortableContext
        id={status}
        items={tasksOrder}
        strategy={verticalListSortingStrategy}
        disabled={disabled}
      >
        <div className="flex-1 overflow-auto overflow-x-hidden">
          <ScrollArea className="h-full w-full px-3" ref={setNodeRef}>
            {query.data
              ?.sort(
                (a, b) => tasksOrder.indexOf(a.id) - tasksOrder.indexOf(b.id)
              )
              ?.map((task) => (
                <SortableTask key={task.id} projectId={id} task={task} />
              ))}
          </ScrollArea>
        </div>
      </SortableContext>
    </section>
  );
}
