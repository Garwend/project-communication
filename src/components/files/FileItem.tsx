import { useState } from "react";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { FileImage, File, MoreVertical, Download, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { toastError } from "~/components/ui/toast";
import ImagePreview from "./ImagePreview";
import { getUserFirstLetters } from "~/lib/utils";

import { api } from "~/utils/api";

import DeleteFile from "./DeleteFile";

import { downloadFileFromUrl } from "~/lib/utils";

type Props = {
  id: string;
  projectId: string;
  name: string;
  type?: string;
  waitingForId?: string;
  taskId?: string;
  createdAt: Date;
  createdBy: string;
};

export default function FileItem({
  id,
  projectId,
  name,
  type,
  waitingForId,
  taskId,
  createdAt,
  createdBy,
}: Props) {
  const [openImage, setOpenImage] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const mutation = api.files.getDownloadS3Url.useMutation({
    onSuccess(data) {
      downloadFileFromUrl(data, name);
    },
    onError() {
      toastError("Nie udało się pobrać pliku");
    },
  });

  return (
    <>
      <div
        className={`mb-2 flex select-none flex-row items-center justify-between rounded-lg border border-border bg-background p-2`}
      >
        <div
          className={`${type?.startsWith("image") ? "cursor-pointer" : ""}`}
          onClick={
            type?.startsWith("image")
              ? () => setOpenImage(true)
              : () => undefined
          }
        >
          <div className="flex flex-row">
            <div className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary p-1 text-primary-foreground">
              {type?.startsWith("image") ? (
                <FileImage className="h-4 w-4" />
              ) : (
                <File className="h-4 w-4" />
              )}
            </div>
            <p>{name}</p>
          </div>
          <div className="mt-4 flex flex-row items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs">
                {getUserFirstLetters(createdBy)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              dodane{" "}
              {formatDistance(createdAt, new Date(), {
                locale: pl,
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="px-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => mutation.mutate({ id: id, projectId: projectId })}
            >
              <Download className="mr-2 h-4 w-4" />
              Pobierz
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setOpenConfirmDelete(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Usuń</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DeleteFile
          id={id}
          projectId={projectId}
          name={name}
          open={openConfirmDelete}
          onOpenChange={setOpenConfirmDelete}
          waitingForId={waitingForId}
          taskId={taskId}
        />
      </div>
      <ImagePreview
        id={id}
        name={name}
        projectId={projectId}
        open={openImage}
        onOpenChange={setOpenImage}
      />
    </>
  );
}
