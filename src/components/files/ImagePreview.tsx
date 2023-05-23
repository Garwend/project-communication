import React from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

type Props = {
  id: string;
  name: string;
  projectId: string;
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ImagePreview({
  id,
  name,
  projectId,
  open,
  onOpenChange,
}: Props) {
  const query = api.files.getImageS3Url.useQuery({
    id: id,
    projectId: projectId,
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm">
        <DialogHeader>
          <DialogTitle className="mb-4">{name}</DialogTitle>
          <Image width={500} height={500} src={query.data ?? ""} alt={name} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
