import Comment from "./Comment";
import { api } from "~/utils/api";

type Props = {
  id: string;
};

export default function CommentList({ id }: Props) {
  const query = api.comments.getAll.useQuery(id);

  return (
    <>
      {query.data?.map((answer) => (
        <Comment
          key={answer.id}
          id={answer.id}
          text={answer.text}
          date={answer.createdAt}
          userId={answer.createdBy.id}
          name={answer.createdBy.name ?? answer.createdBy.email ?? ""}
        />
      ))}
    </>
  );
}
