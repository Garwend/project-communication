import { Home, MessageCircle } from "lucide-react";
import { NavLink } from "../ui/nav-link";
import List from "~/components/projects/List";

export default function Sidebar() {
  return (
    <aside className="h-full flex-shrink-0 flex-grow-0 basis-52 overflow-auto border-r border-border bg-background p-2">
      <div className="flex flex-col gap-2">
        <NavLink href="/" name="Strona główna" icon={Home} />
        <NavLink href="/chat" name="Czat" icon={MessageCircle} />
      </div>
      <List />
    </aside>
  );
}
