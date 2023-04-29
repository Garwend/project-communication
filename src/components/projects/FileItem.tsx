import { Button } from "~/components/ui/button";
import { FileImage, File, MoreVertical, Trash2, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type Props = {
  name: string;
  type?: string;
};

export default function FileItem({ name, type }: Props) {
  return (
    <div className="mb-2 flex select-none flex-row items-center justify-between rounded-lg border border-border bg-background p-2">
      <div className="flex flex-row">
        <div className="mr-2 inline-flex items-center justify-center rounded-md bg-primary p-1 text-primary-foreground">
          {type === "image" ? (
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
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Pobierz
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Usuń
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
