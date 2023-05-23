import React from "react";
import { useInView } from "react-intersection-observer";
import { useSession } from "next-auth/react";
import Message from "./Message";
import { api } from "~/utils/api";

type Props = {
  projectId: string;
  scrollBoxRef: React.RefObject<HTMLDivElement>;
};

export default function MessageBox({ projectId, scrollBoxRef }: Props) {
  const utils = api.useContext();
  const { ref, inView } = useInView();

  const { data, fetchNextPage, isLoading, error } =
    api.chat.getMessages.useInfiniteQuery(
      { projectId: projectId },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  api.chat.viewChat.useQuery(projectId, {
    onSettled() {
      void utils.chat.getAll.invalidate();
    },
  });

  const { data: session } = useSession();

  React.useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isLoading || error) {
    return (
      <div className="w-full flex-1 overflow-auto rounded-md border px-2 pb-2"></div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col-reverse overflow-auto rounded-md border px-2 pb-2">
      <div style={{ float: "left", clear: "both" }} ref={scrollBoxRef}></div>
      {data.pages.map((page, index) => (
        <React.Fragment key={`${page.nextCursor ?? ""} ${index}`}>
          {page.items.map((message) => (
            <Message
              key={message.id}
              isMyMessage={session?.user.id === message.createdById}
              message={message}
            />
          ))}
        </React.Fragment>
      ))}
      <div ref={ref}></div>
    </div>
  );
}
