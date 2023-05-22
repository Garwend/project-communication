import { useRef } from "react";
import { useRouter } from "next/router";
import { useChannel } from "@ably-labs/react-hooks";
import { useSession } from "next-auth/react";

import ChatList from "~/components/chat/ChatList";
import MessageBox from "~/components/chat/MessageBox";
import SendMessage from "~/components/chat/SendMessage";

import { api, type RouterOutputs } from "~/utils/api";

type Message = RouterOutputs["chat"]["getMessages"][0];

type Props = {
  userId: string;
  projectId: string;
  scrollBoxRef: React.RefObject<HTMLDivElement>;
};

type MessageData = {
  type: string;
  message: Message;
};

function ChatChannel({ userId, projectId, scrollBoxRef }: Props) {
  const utils = api.useContext();

  useChannel(userId, "chat-update", (message) => {
    const data = message.data as MessageData;

    if (data.message.projectId === projectId) {
      utils.chat.getMessages.setData(projectId, (old) => {
        if (old) {
          if (data.type === "create") {
            setTimeout(() => {
              if (scrollBoxRef && scrollBoxRef.current) {
                scrollBoxRef.current.scrollIntoView();
              }
            }, 100);

            return [
              ...old,
              { ...data.message, createdAt: new Date(data.message.createdAt) },
            ];
          }

          if (data.type === "update") {
            return old.map((message) =>
              message.id === data.message.id
                ? {
                    ...data.message,
                    createdAt: new Date(data.message.createdAt),
                  }
                : message
            );
          }

          if (data.type === "delete") {
            return old.filter((message) => message.id !== data.message.id);
          }

          return old;
        }
        return old;
      });
    }
  });

  return <></>;
}

export default function Chat() {
  const ref = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const id = useRouter().query.id as string;

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-full w-full flex-row gap-2">
      <ChatList />
      {id ? (
        <div className="flex flex-1 flex-col gap-4">
          <ChatChannel
            key={id}
            userId={session.user.id}
            projectId={id}
            scrollBoxRef={ref}
          />
          <MessageBox projectId={id} scrollBoxRef={ref} />
          <SendMessage projectId={id} />
        </div>
      ) : null}
    </div>
  );
}
