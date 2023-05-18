import { type NextPage } from "next";
import { columns } from "~/components/tasks/table/columns";
import TasksTable from "~/components/tasks/table/TasksTable";
import TaskDetails from "~/components/tasks/TaskDetails";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const query = api.tasks.getMyTasks.useQuery();

  if (query.error || query.isLoading) {
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

export default Home;
