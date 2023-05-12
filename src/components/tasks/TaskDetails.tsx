import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import { CalendarDays, Paperclip, CheckSquare } from "lucide-react";
import { format, formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "~/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getUserFirstLetters } from "~/lib/utils";
import { toastError } from "~/components/ui/toast";
import DeleteTask from "./DeleteTask";
import EditTask from "./EditTask";
import CreateComment from "./comments/CreateComment";
import FileItem from "../files/FileItem";

import { api } from "~/utils/api";

type Props = {
  projectId: string;
};

export default function TaskDetails({ projectId }: Props) {
  const router = useRouter();
  const utils = api.useContext();
  const taskId = router.query.taskId as string;
  const query = api.tasks.getById.useQuery(taskId, {
    retry: false,
    enabled: typeof taskId === "string",
    onError() {
      void router.push(`/projects/${projectId}`);
    },
  });

  const mutation = api.files.getUploadS3Url.useMutation({
    onSuccess(data) {
      mutationFileUpload.mutate(data);
    },
    onError() {
      toastError("Nie udało się dodać pliku");
    },
  });

  const mutationFileUpload = useMutation({
    mutationFn: (url: string) => {
      const file = acceptedFiles[0] as File;
      return axios.put(url, file.slice(), {
        headers: { "Content-Type": file.type },
      });
    },
    onSuccess() {
      void utils.projects.getById.refetch(projectId);
      void utils.tasks.getById.refetch(taskId);
    },
    onError() {
      toastError("Nie udało się dodać pliku");
    },
  });

  const { getRootProps, getInputProps, open, isDragActive, acceptedFiles } =
    useDropzone({
      noClick: true,
      noKeyboard: true,
      multiple: false,
      maxFiles: 1,
      maxSize: 5000000,
      onDropAccepted(files) {
        mutation.mutate({
          taskId: query.data?.id,
          projectId: projectId,
          name: files[0]?.name ?? "",
          type: files[0]?.type ?? "",
        });
      },
      onDropRejected(fileRejections) {
        if (fileRejections[0]?.errors[0]?.code === "file-too-large") {
          toastError("Plik jest zbyt duży maksymalny rozmiar to 5MB");
        } else {
          toastError("Nie udało się dodać pliku");
        }
      },
    });

  if (query.error || query.isLoading) {
    return null;
  }

  return (
    <Sheet
      open={!!router.query.taskId}
      onOpenChange={(value) => {
        if (!value) {
          void router.push(`/projects/${projectId}`);
        }
      }}
    >
      <SheetContent
        position="right"
        {...getRootProps({
          className: "flex flex-col",
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="mt-5 flex h-full w-full items-center justify-center rounded-lg border-4 border-dashed border-primary">
            <h4 className="truncate text-2xl font-semibold tracking-tight">
              Upuść plik żeby go dodać
            </h4>
          </div>
        ) : (
          <>
            <SheetHeader>
              <div className="flex flex-row items-center justify-between pr-6">
                <div className="flex flex-row items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">
                      {getUserFirstLetters(
                        query.data?.createdBy.name ??
                          query.data?.createdBy.email ??
                          ""
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    dodane{" "}
                    {formatDistance(
                      query.data?.createdAt ?? new Date(),
                      new Date(),
                      { locale: pl, addSuffix: true }
                    )}
                  </span>
                </div>
                {query.data?.dueDate ? (
                  <div className="flex flex-row items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      {format(query.data.dueDate, "dd MMMM YYY", {
                        locale: pl,
                      })}
                    </span>
                  </div>
                ) : null}
              </div>
              <SheetTitle className="mt-5">
                {query.data?.priority === "NONE" ? null : (
                  <span
                    className={`mr-2 inline-block h-3 w-3 rounded-full ${
                      query.data?.priority === "LOW"
                        ? "bg-green-600"
                        : query.data?.priority === "MID"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  ></span>
                )}
                {query.data?.name}
              </SheetTitle>
              <Separator />
              <div className="flex flex-row items-center justify-between">
                {query.data?.assignedTo ? (
                  <div>
                    <span className="relative mb-1 inline-block rounded bg-muted px-[0.3rem] py-[0.2rem] text-xs font-semibold">
                      Przypisane do:
                    </span>
                    <div className="flex flex-row items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="text-xs">
                          {getUserFirstLetters(
                            query.data.assignedTo.name ??
                              query.data.assignedTo.email ??
                              ""
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <small className="text-sm font-medium leading-none">
                        {query.data.assignedTo.name ??
                          query.data.assignedTo.email ??
                          ""}
                      </small>
                    </div>
                  </div>
                ) : null}
                <div className="h-0 w-0"></div>
                <div>
                  <Button variant="ghost" className="h-7 w-7 p-0">
                    <CheckSquare className="h-5 w-5" />
                  </Button>
                  <EditTask projectId={projectId} task={query.data} />
                  <Button
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={open}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <DeleteTask projectId={projectId} id={query.data?.id ?? ""} />
                </div>
              </div>
              {query.data?.files === undefined ||
              query.data.files.length === 0 ? null : (
                <Accordion type="single" collapsible>
                  <AccordionItem value="files">
                    <AccordionTrigger>Pliki</AccordionTrigger>
                    <ScrollArea className="pr-4">
                      <div className="max-h-32">
                        <AccordionContent>
                          {query.data?.files.map((file) => (
                            <FileItem
                              key={file.id}
                              id={file.id}
                              projectId={projectId}
                              name={file.name}
                              type={file.type}
                              taskId={taskId}
                            />
                          ))}
                        </AccordionContent>
                      </div>
                    </ScrollArea>
                  </AccordionItem>
                </Accordion>
              )}
            </SheetHeader>
            <div className="mt-4 flex flex-1 flex-col overflow-auto">
              <ScrollArea className="pr-4">
                {query.data?.description?.length !== 0 ? (
                  <SheetDescription className="whitespace-break-spaces">
                    {query.data?.description}
                  </SheetDescription>
                ) : null}
              </ScrollArea>
            </div>
            <SheetFooter>
              <CreateComment projectId={projectId} taskId={query.data.id} />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
