import axios from "axios";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Clock4, Paperclip, MessageCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { toastError } from "~/components/ui/toast";
import WaitingForDetails from "./WaitingForDetails";
import Delivered from "./Delivered";

import { api } from "~/utils/api";

type Props = {
  id: string;
  projectId: string;
  name: string;
  date: Date;
  delivered: boolean;
};

export default function WaitingForItem({
  id,
  projectId,
  name,
  date,
  delivered,
}: Props) {
  const [openDetails, setOpenDetails] = useState(false);
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
      void utils.projects.getById.refetch(projectId);
      void utils.waitingFor.getById.refetch(id);
    },
    onError() {
      toastError("Nie udało się dodać pliku");
    },
  });

  const { getRootProps, getInputProps, isDragActive, open, acceptedFiles } =
    useDropzone({
      noClick: true,
      noKeyboard: true,
      multiple: false,
      maxFiles: 1,
      maxSize: 5000000,
      onDropAccepted(files) {
        mutation.mutate({
          waitingForId: id,
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

  return (
    <>
      <Card
        {...getRootProps({
          className: `mb-2 ${
            isDragActive ? "border-dashed border-primary border-4" : ""
          } ${delivered ? "opacity-50" : ""}`,
        })}
      >
        <input {...getInputProps()} />
        <CardHeader className={isDragActive ? "px-[21px] pt-[21px] " : ""}>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>{name}</CardTitle>
            <Delivered id={id} projectId={projectId} delivered={delivered} />
          </div>
          <div className="inline-flex flex-row items-center gap-1 text-xs text-muted-foreground">
            <Clock4 className="inline-block h-3 w-3" />
            {formatDistance(date, new Date(), { locale: pl, addSuffix: true })}
          </div>
        </CardHeader>
        <CardFooter className={isDragActive ? "px-[21px] pb-[21px] " : ""}>
          <Button onClick={() => setOpenDetails(true)}>
            <MessageCircle className="mr-2 h-4 w-4" /> Odpowiedz
          </Button>
          <Button className="ml-2" variant="outline" onClick={open}>
            <Paperclip className="mr-2 h-4 w-4" />{" "}
            {isDragActive ? "Upuść plik żeby go dodać" : "Dodaj Załącznik"}
          </Button>
        </CardFooter>
      </Card>
      <WaitingForDetails
        id={id}
        openDetails={openDetails}
        onOpenChange={setOpenDetails}
      />
    </>
  );
}
