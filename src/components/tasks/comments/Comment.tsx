import { useState } from "react";
import { useSession } from "next-auth/react";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import DeleteComment from "./DeleteComment";
import EditComment from "./EditComment";
import { getUserFirstLetters } from "~/lib/utils";

type Props = {
  id: string;
  userId: string;
  name: string;
  text: string;
  date: Date;
};

export default function Comment({ name, text, date, userId, id }: Props) {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { data: session } = useSession();

  return (
    <>
      <div className="mt-4">
        <section className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>{getUserFirstLetters(name)}</AvatarFallback>
            </Avatar>
            <small className="text-sm font-medium leading-none">{name}</small>
            <p className="text-sm text-muted-foreground">
              {formatDistance(date, new Date(), {
                locale: pl,
                addSuffix: true,
              })}
            </p>
          </div>
          {session?.user.id !== userId ? null : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="px-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edytuj</span>
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
          )}
        </section>
        <p className="mt-2 whitespace-break-spaces">{text}</p>
      </div>
      <DeleteComment
        open={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        id={id}
      />
      <EditComment
        open={openEdit}
        onOpenChange={setOpenEdit}
        text={text}
        id={id}
      />
    </>
  );
}
