import { useDropzone } from "react-dropzone";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { toastError } from "~/components/ui/toast";
import FileItem from "./FileItem";
import { api } from "~/utils/api";

type Props = {
  id: string;
};

export default function FilesList({ id }: Props) {
  const utils = api.useContext();
  const mutation = api.files.getUploadS3Url.useMutation({
    onSuccess() {
      void utils.projects.getById.refetch(id);
    },
  });

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    maxFiles: 1,
    maxSize: 5000000,
    onDropAccepted(files) {
      mutation.mutate({
        projectId: id,
        name: files[0]?.name ?? "",
        type: files[0]?.type ?? "",
      });
    },
    onDropRejected(fileRejections) {
      if (fileRejections[0]?.errors[0]?.code === "file-too-large") {
        toastError("Plik jest zbyt duży maksymalny rozmiar to 5MB");
      } else {
        toastError("Nie można dodać tego pliku");
      }
    },
  });

  return (
    <Card className="w-3/4">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Przesłane pliki</CardTitle>
          <Button variant="ghost" className="h-7 w-7 p-0" onClick={open}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-64">
        <div
          {...getRootProps({
            className: "h-full",
          })}
        >
          {isDragActive ||
          utils.projects.getById.getData(id)?.files === undefined ||
          utils.projects.getById.getData(id)?.files.length === 0 ? (
            <div
              className={`flex h-full items-center justify-center border-4 border-dashed p-2 ${
                isDragActive ? "border-primary" : ""
              }`}
            >
              <input {...getInputProps()} />
              <h4 className="truncate text-2xl font-semibold tracking-tight">
                Przeciągni i upuść plik żeby go dodać
              </h4>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              {utils.projects.getById.getData(id)?.files.map((file) => (
                <FileItem key={file.id} name={file.name} type={file.type} />
              ))}
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
