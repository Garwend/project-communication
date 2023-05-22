import { useRouter } from "next/router";
import ChatList from "~/components/chat/ChatList";
import MessageBox from "~/components/chat/MessageBox";
import SendMessage from "~/components/chat/SendMessage";

export default function Chat() {
  const id = useRouter().query.id as string;

  return (
    <div className="flex h-full w-full flex-row gap-2">
      <ChatList />
      {id ? (
        <div className="flex flex-1 flex-col gap-4">
          <MessageBox projectId={id} />
          <SendMessage projectId={id} />
        </div>
      ) : null}
    </div>
  );
}
