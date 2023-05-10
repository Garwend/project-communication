import TasksGroup from "./TasksGroup";

type Props = {
  id: string;
};

export default function Tasks({ id }: Props) {
  return (
    <div className="mt-2 flex h-96 flex-row gap-2">
      <TasksGroup id={id} title="Oczekiwanie na realizacje" create={true} />
      <TasksGroup id={id} title="W realizacji" create={false} />
      <TasksGroup id={id} title="Zrealizowane" create={false} />
    </div>
  );
}
