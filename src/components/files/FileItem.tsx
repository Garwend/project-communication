import { useState } from "react";
import { Button } from "~/components/ui/button";
import { FileImage, File, MoreVertical, Download, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toastError } from "~/components/ui/toast";

import { api } from "~/utils/api";

import DeleteFile from "./DeleteFile";

import { downloadFileFromUrl } from "~/lib/utils";

type Props = {
  id: string;
  projectId: string;
  name: string;
  type?: string;
};

export default function FileItem({ id, projectId, name, type }: Props) {
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
    <div className="mb-2 flex select-none flex-row items-center justify-between rounded-lg border border-border bg-background p-2">
      <div className="flex flex-row">
        <div className="mr-2 inline-flex items-center justify-center rounded-md bg-primary p-1 text-primary-foreground">
          {type?.startsWith("image") ? (
            <FileImage className="h-4 w-4" />
          ) : (
            <File className="h-4 w-4" />
          )}
        </div>
        <p>{name}</p>
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
      />
    </div>
  );
}
