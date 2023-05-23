import ChatItem from "~/components/chat/ChatItem";
import { ScrollArea } from "~/components/ui/scroll-area";
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

  if (query.isError || query.isLoading) {
    return <section className="h-full w-64 border-r border-border"></section>;
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
