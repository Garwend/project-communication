import { useRouter } from "next/router";
import Link from "next/link";

type Props = {
  id: string;
  name: string;
};

export default function ChatItem({ id, name }: Props) {
  const currentId = useRouter().query.id;

  return (
    <Link href={{ pathname: "/chat", query: { id: id } }}>
      <div
        className={`mb-1 cursor-pointer rounded-md p-2 hover:bg-accent ${
          currentId === id ? "bg-accent" : "bg-background"
        }`}
      >
        <h5 className="text-lg font-semibold">{name}</h5>
        {/* <p className="text-sm text-muted-foreground">dolor sit amet</p> */}
      </div>
    </Link>
  );
}
