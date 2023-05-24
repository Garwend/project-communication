import { type NextPage } from "next";
import { columns } from "~/components/tasks/table/columns";
import TasksTable from "~/components/tasks/table/TasksTable";
import TaskDetails from "~/components/tasks/TaskDetails";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const query = api.tasks.getMyTasks.useQuery();

  if (query.isLoading) {
    return <SkeletonLoading />;
  }

  if (query.error) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <TasksTable columns={columns} data={query.data} />
      <TaskDetails
        redirectUrl="/"
        redirectToMainPage={true}
        refetchMyTasks={true}
        fetchProject={true}
      />
    </div>
  );
};

function SkeletonLoading() {
  return (
    <div className="flex h-full flex-col">
      <section className="mb-2 flex flex-row gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </section>
      <Skeleton className="w-full flex-1" />
    </div>
  );
}

export default Home;
