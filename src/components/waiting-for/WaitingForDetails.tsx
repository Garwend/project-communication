import React from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { Paperclip } from "lucide-react";
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
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { toastError } from "~/components/ui/toast";
import CustomLinkify from "~/components/ui/custom-linkify";
import EditWaitingFor from "./EditWaitingFor";
import DeleteWaitingFor from "./DeleteWaitingFor";
import FileItem from "../files/FileItem";
import Delivered from "./Delivered";
import CreateAnswer from "../answers/CreateAnswer";
import AnswersList from "../answers/AnswersList";

import { api } from "~/utils/api";

type Props = {
  id: string;
  openDetails: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function WaitingForDetails({
  id,
  openDetails,
  onOpenChange,
}: Props) {
  const query = api.waitingFor.getById.useQuery(id);

  const utils = api.useContext();

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
      void utils.projects.getById.refetch(query.data?.projectId);
      void utils.waitingFor.getById.refetch(id);
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
          waitingForId: id,
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

  return (
    <Sheet open={openDetails} onOpenChange={onOpenChange}>
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
              <div className="mt-5 flex flex-row items-center justify-between">
                <SheetTitle>{query.data?.name}</SheetTitle>
                <div>
                  <Delivered
                    id={id}
                    projectId={query.data?.projectId ?? ""}
                    delivered={query.data?.delivered ?? false}
                  />
                  <Button
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={open}
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <EditWaitingFor
                    id={id}
                    projectId={query.data?.projectId ?? ""}
                  />
                  <DeleteWaitingFor id={id} />
                </div>
              </div>
              <Separator className="my-4" />
              <ScrollArea className="pr-4">
                <div className="max-h-48">
                  <SheetDescription className="whitespace-break-spaces">
                    <CustomLinkify>{query.data?.description}</CustomLinkify>
                  </SheetDescription>
                </div>
              </ScrollArea>
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
                              projectId={query.data?.projectId ?? ""}
                              name={file.name}
                              type={file.type}
                              waitingForId={id}
                              createdAt={file.createdAt}
                              createdBy={
                                file.createdBy.name ??
                                file.createdBy.email ??
                                ""
                              }
                            />
                          ))}
                        </AccordionContent>
                      </div>
                    </ScrollArea>
                  </AccordionItem>
                </Accordion>
              )}
            </SheetHeader>
            <AnswersList id={id} />
            <SheetFooter>
              <CreateAnswer
                projectId={query.data?.projectId ?? ""}
                waitingForId={id}
              />
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
