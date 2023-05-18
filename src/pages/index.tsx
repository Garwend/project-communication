import { type NextPage } from "next";
import { columns } from "~/components/tasks/table/columns";
import TasksTable from "~/components/tasks/table/TasksTable";
import TasksTableToolbar from "~/components/tasks/table/TasksTableToolbar";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const query = api.tasks.getMyTasks.useQuery();

  if (query.error || query.isLoading) {
    return null;
  }

  return (
    <div className="flex h-full flex-col">
      <TasksTableToolbar />
      <TasksTable columns={columns} data={query.data} />
    </div>
  );
};

export default Home;
