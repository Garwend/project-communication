import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  defaultDropAnimation,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  type DropAnimation,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import TaskDetails from "./TaskDetails";
import TasksGroup from "./TasksGroup";
import Task from "./Task";
import { toastError } from "../ui/toast";
import { api, type RouterOutputs } from "~/utils/api";
import CreateTask from "./CreateTask";

type Props = {
  id: string;
  project: Project;
};

type Status = RouterOutputs["tasks"]["getAll"][0]["status"];
type Task = RouterOutputs["tasks"]["getAll"][0];
type Project = RouterOutputs["projects"]["getById"];

export default function Tasks({ id, project }: Props) {
  const utils = api.useContext();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [projectData, setProjectData] = useState(() => project);

  useEffect(() => {
    setProjectData(project);
  }, [project]);

  const mutation = api.tasks.changeStatus.useMutation({
    onError() {
      toastError("Nie udało się przenieść zadania");
    },
    onSettled() {
      void utils.tasks.getAll.invalidate({
        status: "WAITING",
        projectId: id,
      });
      void utils.tasks.getAll.invalidate({
        status: "IN_PROGRESS",
        projectId: id,
      });
      void utils.tasks.getAll.invalidate({
        status: "FINISHED",
        projectId: id,
      });
      void utils.projects.getById.invalidate(id);
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current as Task;
    if (task) {
      setActiveTask(task);
    }
  };

  const findContainer = (id: string) => {
    if (["WAITING", "IN_PROGRESS", "FINISHED"].includes(id)) {
      return id;
    }

    if (projectData.WAITING_ORDER.includes(id)) {
      return "WAITING";
    }

    if (projectData.IN_PROGRESS_ORDER.includes(id)) {
      return "IN_PROGRESS";
    }

    if (projectData.FINISHED_ORDER.includes(id)) {
      return "FINISHED";
    }
  };

  const getTasksOrder = (id: string) => {
    if (id === "IN_PROGRESS") {
      return projectData.IN_PROGRESS_ORDER;
    } else if (id === "FINISHED") {
      return projectData.FINISHED_ORDER;
    } else {
      return projectData.WAITING_ORDER;
    }
  };

  const handleDragOver = ({ over, active }: DragOverEvent) => {
    const overId = over?.id as string | undefined;
    const activeId = active.id as string;

    if (!overId) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(activeId);

    if (!activeContainer || !overContainer) {
      return;
    }

    const activeItems = getTasksOrder(activeContainer);
    const overItems = getTasksOrder(overContainer);
    const overIndex = overItems.indexOf(overId);
    const activeIndex = activeItems.indexOf(activeId);

    if (activeContainer !== overContainer) {
      setProjectData((old) =>
        old
          ? {
              ...old,
              [`${activeContainer as Status}_ORDER`]: old[
                `${activeContainer as Status}_ORDER`
              ].filter((item) => item !== active.id),
              [`${overContainer as Status}_ORDER`]: [
                ...old[`${overContainer as Status}_ORDER`].slice(0, overIndex),
                old[`${activeContainer as Status}_ORDER`][activeIndex],
                ...old[`${overContainer as Status}_ORDER`].slice(
                  overIndex,
                  old[`${overContainer as Status}_ORDER`].length
                ),
              ],
            }
          : old
      );

      const task = active.data.current as Task;

      utils.tasks.getAll.setData(
        { projectId: project.id, status: activeContainer as Status },
        (old) => (old ? old.filter((item) => item.id !== activeId) : undefined)
      );
      utils.tasks.getAll.setData(
        { projectId: project.id, status: overContainer as Status },
        (old) => {
          if (old) {
            const exists = old.find((item) => item.id === task.id);

            if (exists) {
              return old;
            }

            return [task, ...old];
          }
          return undefined;
        }
      );
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const overId = over?.id as string | undefined;
    const activeId = active.id as string;

    if (!overId) {
      return;
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(activeId);

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeItems = getTasksOrder(activeContainer);
    const overItems = getTasksOrder(overContainer);
    const overIndex = overItems.indexOf(overId);
    const activeIndex = activeItems.indexOf(activeId);

    if (activeIndex !== overIndex) {
      setProjectData((old) =>
        old
          ? {
              ...old,
              [`${overContainer as Status}_ORDER`]: arrayMove(
                old[`${overContainer as Status}_ORDER`],
                activeIndex,
                overIndex
              ),
            }
          : old
      );
    }

    mutation.mutate({
      id: activeId,
      status: overContainer as Status,
      index: overIndex,
      currentIndex: activeIndex,
    });

    setActiveTask(null);
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  return (
    <>
      <CreateTask id={id} />
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
      >
        <div className="flex h-[calc(100vh-12rem)] flex-row gap-2">
          <TasksGroup
            id={id}
            title="Oczekiwanie na realizacje"
            status="WAITING"
            projectData={projectData}
            disabled={mutation.isLoading}
          />
          <TasksGroup
            id={id}
            title="W realizacji"
            status="IN_PROGRESS"
            projectData={projectData}
            disabled={mutation.isLoading}
          />
          <TasksGroup
            id={id}
            title="Zrealizowane"
            status="FINISHED"
            projectData={projectData}
            disabled={mutation.isLoading}
          />
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask ? <Task task={activeTask} projectId={id} /> : null}
        </DragOverlay>
      </DndContext>
      <TaskDetails projectId={id} />
    </>
  );
}
