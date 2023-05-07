import { useRef } from "react";
import Answer from "./Answer";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/utils/api";

type Props = {
  id: string;
};

export default function AnswersList({ id }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const query = api.answers.getAll.useQuery(id, {
    onSuccess() {
      if (ref.current) {
        ref.current.scrollIntoView();
      }
    },
  });

  return (
    <div className="flex flex-1 flex-col justify-end overflow-auto">
      <ScrollArea>
        {query.data?.map((answer) => (
          <Answer
            key={answer.id}
            text={answer.text}
            date={answer.createdAt}
            name={answer.createdBy.name ?? answer.createdBy.email ?? ""}
          />
        ))}
        <div style={{ float: "left", clear: "both" }} ref={ref}></div>
      </ScrollArea>
    </div>
  );
}
