import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";

import CreateTask from "./CreateTask";
import Task from "./Task";

import { api } from "~/utils/api";

type Props = {
  id: string;
  title: string;
  create: boolean;
};

export default function TasksGroup({ id, title, create }: Props) {
  const query = api.tasks.getAll.useQuery(id);

  return (
    <section className="flex w-72 flex-col rounded-lg border p-2">
      <header className="flex flex-shrink-0 flex-row items-center justify-between">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {title}
        </h4>
        {create ? <CreateTask id={id} /> : null}
      </header>
      <Separator className="my-2 flex-shrink-0" />
      <ScrollArea className="pr-4">
        <div className="flex flex-col gap-2">
          {query.data?.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </div>
      </ScrollArea>
    </section>
  );
}
