import { useState } from "react";
import { MoreVertical, Trash2, Edit } from "lucide-react";
import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { getUserFirstLetters } from "~/lib/utils";
import { type RouterOutputs } from "~/utils/api";
import CustomLinkify from "~/components/ui/custom-linkify";
import DeleteMessage from "./DeleteMessage";
import EditMessage from "./EditMessage";

type Message = RouterOutputs["chat"]["getMessages"][0];

type Props = {
  message: Message;
  isMyMessage: boolean;
};

export default function Message({ isMyMessage, message }: Props) {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  return (
    <>
      <div
        className={`mt-4 flex w-full items-end gap-2 ${
          isMyMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback>
            {getUserFirstLetters(
              message.createdBy.name ?? message.createdBy.email ?? ""
            )}
          </AvatarFallback>
        </Avatar>
        <div className="max-w-[85%]">
          <p
            className={`text-sm text-muted-foreground ${
              isMyMessage ? "text-right" : ""
            }`}
          >
            {formatDistance(message.createdAt, new Date(), {
              locale: pl,
              addSuffix: true,
            })}
          </p>
          <div
            className={`flex flex-row items-center gap-2 ${
              isMyMessage ? "justify-end" : "justify-start"
            }`}
          >
            {isMyMessage ? (
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
            ) : null}

            <div
              className={`rounded-md p-3 ${
                isMyMessage
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary"
              }`}
            >
              <p
                className="whitespace-break-spaces"
                style={{ overflowWrap: "anywhere" }}
              >
                <CustomLinkify>{message.text}</CustomLinkify>
              </p>
            </div>
          </div>
        </div>
      </div>
      <DeleteMessage
        open={openConfirmDelete}
        onOpenChange={setOpenConfirmDelete}
        id={message.id}
      />
      <EditMessage
        open={openEdit}
        onOpenChange={setOpenEdit}
        id={message.id}
        text={message.text}
      />
    </>
  );
}
