import { useRouter } from "next/router";
import Link from "next/link";

type Props = {
  id: string;
  name: string;
  lastMessage: string;
};

export default function ChatItem({ id, name, lastMessage }: Props) {
  const currentId = useRouter().query.id;

  return (
    <Link href={{ pathname: "/chat", query: { id: id } }}>
      <div
        className={`mb-1 cursor-pointer truncate rounded-md p-2 hover:bg-accent ${
          currentId === id ? "bg-accent" : "bg-background"
        }`}
      >
        <h5 className="text-lg font-semibold">{name}</h5>
        <p className="w-56 truncate text-sm text-muted-foreground">
          {lastMessage}
        </p>
      </div>
    </Link>
  );
}
