import { useRef } from "react";
import { useRouter } from "next/router";
import { useChannel } from "@ably-labs/react-hooks";
import { useSession } from "next-auth/react";
import { MessagesSquare } from "lucide-react";

import ChatList from "~/components/chat/ChatList";
import MessageBox from "~/components/chat/MessageBox";
import SendMessage from "~/components/chat/SendMessage";

import { api, type RouterOutputs } from "~/utils/api";

type Message = RouterOutputs["chat"]["getMessages"]["items"][0];

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
      utils.chat.getMessages.setInfiniteData(
        { projectId: projectId },
        (old) => {
          if (old) {
            if (data.type === "create") {
              setTimeout(() => {
                if (scrollBoxRef && scrollBoxRef.current) {
                  scrollBoxRef.current.scrollIntoView();
                }
              }, 100);

              return {
                ...old,
                pages: old.pages.map((page, index) => {
                  if (index === 0) {
                    return {
                      ...page,
                      items: [
                        {
                          ...data.message,
                          createdAt: new Date(data.message.createdAt),
                        },
                        ...page.items,
                      ],
                    };
                  }

                  return {
                    ...page,
                  };
                }),
              };
            }

            if (data.type === "update") {
              return {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  items: page.items.map((message) =>
                    message.id === data.message.id
                      ? {
                          ...data.message,
                          createdAt: new Date(data.message.createdAt),
                        }
                      : message
                  ),
                })),
              };
            }

            if (data.type === "delete") {
              return {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  items: page.items.filter(
                    (message) => message.id !== data.message.id
                  ),
                })),
              };
            }

            return old;
          }
          return old;
        }
      );
      void utils.chat.viewChat.invalidate(projectId);
    } else {
      void utils.chat.getAll.invalidate();
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
      <ChatChannel
        key={id}
        userId={session.user.id}
        projectId={id}
        scrollBoxRef={ref}
      />
      {id ? (
        <div className="flex flex-1 flex-col gap-4">
          <MessageBox projectId={id} scrollBoxRef={ref} />
          <SendMessage projectId={id} />
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <MessagesSquare className="h-72 w-72" />
          <p className="text-2xl text-muted-foreground">
            Wybierz czat z listy po lewej stronie.
          </p>
        </div>
      )}
    </div>
  );
}
