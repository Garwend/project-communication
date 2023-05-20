import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import CustomLinkify from "../ui/custom-linkify";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetFooter,
} from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import { toastError } from "~/components/ui/toast";
import TaskDetailsHeader from "./TaskDetailsHeader";
import CreateComment from "./comments/CreateComment";
import CommentList from "./comments/CommentList";

import { api } from "~/utils/api";

type Props = {
  redirectUrl: string;
  redirectToMainPage?: boolean;
  refetchMyTasks?: boolean;
  fetchProject?: boolean;
};

export default function TaskDetails({
  redirectUrl,
  redirectToMainPage,
  refetchMyTasks,
  fetchProject,
}: Props) {
  const router = useRouter();
  const utils = api.useContext();
  const taskId = router.query.taskId as string;
  const query = api.tasks.getById.useQuery(taskId, {
    retry: false,
    enabled: typeof taskId === "string",
    onError() {
      void router.push(redirectUrl);
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
      void utils.projects.getById.refetch(query.data?.projectId ?? "");
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
          projectId: query.data?.projectId ?? "",
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
          void router.push(redirectUrl);
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
              <TaskDetailsHeader
                task={query.data}
                openFile={open}
                dialog={true}
                redirectToMainPage={redirectToMainPage}
                refetchMyTasks={refetchMyTasks}
                fetchProject={fetchProject}
              />
            </SheetHeader>
            <div className="mt-4 flex flex-1 flex-col overflow-auto">
              <ScrollArea className="pr-4">
                {query.data?.description?.length !== 0 ? (
                  <SheetDescription className="whitespace-break-spaces">
                    <CustomLinkify>{query.data?.description}</CustomLinkify>
                  </SheetDescription>
                ) : null}
                <CommentList id={query.data.id} />
              </ScrollArea>
            </div>
            <SheetFooter>
              <CreateComment
                projectId={query.data.projectId}
                taskId={query.data.id}
              />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
