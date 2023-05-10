import TasksGroup from "./TasksGroup";

type Props = {
  id: string;
};

export default function Tasks({ id }: Props) {
  return (
    <div className="mt-2 flex h-[calc(100vh-10rem)] flex-row gap-2">
      <TasksGroup id={id} title="Oczekiwanie na realizacje" create={true} />
      {/* <TasksGroup id={id} title="W realizacji" create={false} />
      <TasksGroup id={id} title="Zrealizowane" create={false} /> */}
    </div>
  );
}
