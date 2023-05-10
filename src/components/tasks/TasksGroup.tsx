import { Separator } from "~/components/ui/separator";

import CreateTask from "./CreateTask";

type Props = {
  id: string;
  title: string;
  create: boolean;
};

export default function TasksGroup({ id, title, create }: Props) {
  return (
    <section className="h-full w-72 rounded-lg border p-2">
      <header className="flex flex-row items-center justify-between">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {title}
        </h4>
        {create ? <CreateTask id={id} /> : null}
      </header>
      <Separator className="my-2" />
    </section>
  );
}
