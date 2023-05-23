import { useRouter } from "next/router";
import Link from "next/link";

type Props = {
  id: string;
  name: string;
  lastMessage: string;
  newMessage: boolean;
};

export default function ChatItem({ id, name, lastMessage, newMessage }: Props) {
  const currentId = useRouter().query.id;

  return (
    <Link href={{ pathname: "/chat", query: { id: id } }}>
      <div
        className={`relative mb-1 cursor-pointer truncate rounded-md p-2 hover:bg-accent ${
          currentId === id ? "bg-accent" : "bg-background"
        }`}
      >
        <h5 className="relative w-56 truncate text-lg font-semibold">{name}</h5>

        <p className="w-56 truncate text-sm text-muted-foreground">
          {lastMessage}
        </p>
        {newMessage ? (
          <span className="absolute right-2 top-2 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-foreground opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
          </span>
        ) : null}
      </div>
    </Link>
  );
}
