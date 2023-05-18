import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/router";
import { ScrollArea } from "~/components/ui/scroll-area";
import CommentList from "~/components/tasks/comments/CommentList";
import CreateComment from "~/components/tasks/comments/CreateComment";
import TaskDetailsHeader from "~/components/tasks/TaskDetailsHeader";
import { Skeleton } from "~/components/ui/skeleton";
import { toastError } from "~/components/ui/toast";
import { api } from "~/utils/api";

export default function TaskPage() {
  const id = useRouter().query.id as string;
  const utils = api.useContext();
  const query = api.tasks.getById.useQuery(id, {
    retry: false,
    enabled: typeof id === "string",
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
      void utils.tasks.getById.refetch(id);
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

  if (query.isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Skeleton className="h-[95%] w-[95%] max-w-3xl rounded-md" />
      </div>
    );
  }

  if (query.error) {
    return (
      <div>
        <h1>Nie znaleziono zadania</h1>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        {...getRootProps({
          className:
            "flex h-[95%] w-[95%] max-w-3xl flex-col rounded-md border p-4",
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex h-full w-full items-center justify-center rounded-lg border-4 border-dashed border-primary">
            <h4 className="truncate text-2xl font-semibold tracking-tight">
              Upuść plik żeby go dodać
            </h4>
          </div>
        ) : (
          <>
            <header>
              <TaskDetailsHeader
                task={query.data}
                openFile={open}
                dialog={false}
                redirectToMainPage={true}
                fetchProject={true}
              />
            </header>
            <section className="mt-4 flex flex-1 flex-col overflow-auto">
              <ScrollArea className="pr-4">
                {query.data?.description?.length !== 0 ? (
                  <p className="whitespace-break-spaces text-sm text-muted-foreground">
                    {query.data?.description}
                  </p>
                ) : null}
                <CommentList id={query.data.id} />
              </ScrollArea>
            </section>
            <footer className="mt-4">
              <CreateComment
                projectId={query.data.projectId}
                taskId={query.data.id}
              />
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
