import { type NextPage } from "next";
import TasksTable from "~/components/tasks/table/TasksTable";

const Home: NextPage = () => {
  return (
    <div className="h-full">
      <TasksTable />
    </div>
  );
};

export default Home;
