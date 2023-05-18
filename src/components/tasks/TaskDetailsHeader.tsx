import { CalendarDays, Paperclip } from "lucide-react";
import { format, formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { SheetTitle } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import EditTask from "./EditTask";
import DeleteTask from "./DeleteTask";
import FileItem from "../files/FileItem";
import { getUserFirstLetters } from "~/lib/utils";
import { type RouterOutputs } from "~/utils/api";

type Task = RouterOutputs["tasks"]["getById"];

type Props = {
  task: Task;
  openFile: () => void;
  dialog: boolean;
  redirectToMainPage?: boolean;
  refetchMyTasks?: boolean;
  fetchProject?: boolean;
};

export default function TaskDetailsHeader({
  task,
  openFile,
  dialog,
  redirectToMainPage,
  refetchMyTasks,
  fetchProject,
}: Props) {
  return (
    <>
      <div
        className={`flex flex-row items-center justify-between ${
          dialog ? "pr-6" : ""
        }`}
      >
        <div className="flex flex-row items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src="" />
            <AvatarFallback className="text-xs">
              {getUserFirstLetters(
                task.createdBy.name ?? task.createdBy.email ?? ""
              )}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            dodane{" "}
            {formatDistance(task.createdAt ?? new Date(), new Date(), {
              locale: pl,
              addSuffix: true,
            })}
          </span>
        </div>
        {!dialog ? (
          <span className="relative mb-1 inline-block rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-semibold">
            {task.status === "WAITING"
              ? "Oczekiwanie na realizacje"
              : task.status === "IN_PROGRESS"
              ? "W realizacji"
              : "Zrealizowano"}
          </span>
        ) : null}
        {task.dueDate ? (
          <div className="flex flex-row items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span className="text-sm text-muted-foreground">
              {format(task.dueDate, "dd MMMM YYY", {
                locale: pl,
              })}
            </span>
          </div>
        ) : null}
      </div>
      {dialog ? (
        <SheetTitle className="mt-5 break-words">
          {task.priority === "NONE" ? null : (
            <span
              className={`mr-2 inline-block h-3 w-3 rounded-full ${
                task.priority === "LOW"
                  ? "bg-green-600"
                  : task.priority === "MID"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            ></span>
          )}
          {task.name}
        </SheetTitle>
      ) : (
        <h2 className="mt-5 break-words text-lg font-semibold text-foreground">
          {task.priority === "NONE" ? null : (
            <span
              className={`mr-2 inline-block h-3 w-3 rounded-full ${
                task.priority === "LOW"
                  ? "bg-green-600"
                  : task.priority === "MID"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            ></span>
          )}
          {task.name}
        </h2>
      )}

      <Separator className={dialog ? "" : "my-2"} />
      <div className="flex flex-row items-center justify-between">
        {task.assignedTo ? (
          <div>
            <span className="relative mb-1 inline-block rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-semibold">
              Przypisane do:
            </span>
            <div className="flex flex-row items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {getUserFirstLetters(
                    task.assignedTo.name ?? task.assignedTo.email ?? ""
                  )}
                </AvatarFallback>
              </Avatar>
              <small className="text-sm font-medium leading-none">
                {task.assignedTo.name ?? task.assignedTo.email ?? ""}
              </small>
            </div>
          </div>
        ) : null}
        <div className="h-0 w-0"></div>
        <div>
          <EditTask
            projectId={task.projectId}
            task={task}
            fetchProject={fetchProject ?? false}
            refetchMyTasks={refetchMyTasks}
          />
          <Button variant="ghost" className="h-7 w-7 p-0" onClick={openFile}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <DeleteTask
            projectId={task.projectId}
            id={task.id}
            redirectToMainPage={redirectToMainPage}
            refetchMyTasks={refetchMyTasks}
          />
        </div>
      </div>
      {task.files === undefined || task.files.length === 0 ? null : (
        <Accordion type="single" collapsible>
          <AccordionItem value="files">
            <AccordionTrigger>Pliki ({task.files.length})</AccordionTrigger>
            <ScrollArea className="pr-4">
              <div className="max-h-32">
                <AccordionContent>
                  {task.files.map((file) => (
                    <FileItem
                      key={file.id}
                      id={file.id}
                      projectId={task.projectId}
                      name={file.name}
                      type={file.type}
                      taskId={task.id}
                    />
                  ))}
                </AccordionContent>
              </div>
            </ScrollArea>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
}
