import TaskDetails from "./TaskDetails";
import TasksGroup from "./TasksGroup";

type Props = {
  id: string;
};

export default function Tasks({ id }: Props) {
  return (
    <>
      <div className="mt-2 flex h-[calc(100vh-10rem)] flex-row gap-2">
        <TasksGroup
          id={id}
          title="Oczekiwanie na realizacje"
          create={true}
          status="WAITING"
        />
        <TasksGroup
          id={id}
          title="W realizacji"
          create={false}
          status="IN_PROGRESS"
        />
        <TasksGroup
          id={id}
          title="Zrealizowane"
          create={false}
          status="FINISHED"
        />
      </div>
      <TaskDetails projectId={id} />
    </>
  );
}
