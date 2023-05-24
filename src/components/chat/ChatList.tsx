import ChatItem from "~/components/chat/ChatItem";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { XOctagon } from "lucide-react";
import { api } from "~/utils/api";

const checkIfNewMessage = (messageDate?: Date, lastChatViewDate?: Date) => {
  if (!messageDate || !lastChatViewDate) {
    return false;
  }

  if (messageDate < lastChatViewDate) {
    return false;
  }

  return true;
};

export default function ChatList() {
  const query = api.chat.getAll.useQuery();

  if (query.isLoading) {
    return <SkeletonLoading />;
  }

  if (query.isError) {
    return (
      <section className="flex h-full w-64 items-center justify-center border-r border-border pr-2">
        <div className="flex flex-col items-center">
          <XOctagon className="h-8 w-8 text-destructive" />
          <p className="mt-2 text-center text-sm font-bold text-muted-foreground">
            Nie udało się załadować listy czatów
          </p>
        </div>
      </section>
    );
  }

  if (query.data.length === 0) {
    return (
      <section className="flex h-full w-64 items-center justify-center border-r border-border pr-2">
        <p className="text-center text-sm font-bold text-muted-foreground">
          Gdy dołączysz lub stworzysz projekt pojawi się tutaj czat dotyczący
          tego projektu.
        </p>
      </section>
    );
  }

  return (
    <section className="h-full w-64 border-r border-border">
      <ScrollArea className="h-full pr-2">
        {query.data.map((item) => (
          <ChatItem
            key={item.id}
            name={item.name}
            id={item.id}
            lastMessage={item.messages[0]?.text ?? ""}
            newMessage={checkIfNewMessage(
              item.messages[0]?.createdAt,
              item.lastChatView[0]?.date
            )}
          />
        ))}
      </ScrollArea>
    </section>
  );
}

function SkeletonLoading() {
  return (
    <section className="flex h-full w-64 flex-col gap-3 border-r border-border pr-2">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </section>
  );
}
