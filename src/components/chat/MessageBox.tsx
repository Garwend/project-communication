import React from "react";
import { useSession } from "next-auth/react";
import Message from "./Message";
import { api } from "~/utils/api";

type Props = {
  projectId: string;
  scrollBoxRef: React.RefObject<HTMLDivElement>;
};

export default function MessageBox({ projectId, scrollBoxRef }: Props) {
  const query = api.chat.getMessages.useQuery(projectId, {
    onSuccess() {
      setTimeout(() => {
        if (scrollBoxRef && scrollBoxRef.current) {
          scrollBoxRef.current.scrollIntoView();
        }
      }, 100);
    },
  });
  const { data: session } = useSession();

  if (query.isLoading || query.error) {
    return (
      <div className="w-full flex-1 overflow-auto rounded-md border px-2 pb-2"></div>
    );
  }

  return (
    <div className="w-full flex-1 overflow-auto rounded-md border px-2 pb-2">
      {query.data.map((message) => (
        <Message
          key={message.id}
          isMyMessage={session?.user.id === message.createdById}
          message={message}
        />
      ))}
      <div style={{ float: "left", clear: "both" }} ref={scrollBoxRef}></div>
    </div>
  );
}
