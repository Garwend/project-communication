import { useRouter } from "next/router";
import { useChannel } from "@ably-labs/react-hooks";
import { useSession } from "next-auth/react";

import ChatList from "~/components/chat/ChatList";
import MessageBox from "~/components/chat/MessageBox";
import SendMessage from "~/components/chat/SendMessage";

type Message = {
  message: string;
  name: string;
};

export default function Chat() {
  const { data: session } = useSession();
  const id = useRouter().query.id as string;

  // useChannel(session?.user.id ?? "", "chat-update", (message) => {
  //   console.log(message.data);
  // });

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
