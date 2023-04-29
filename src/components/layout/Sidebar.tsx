import { Home } from "lucide-react";
import { NavLink } from "../ui/nav-link";
import List from "~/components/projects/List";

export default function Sidebar() {
  return (
    <aside className="h-full flex-shrink-0 flex-grow-0 basis-52 overflow-auto border-r border-border bg-background p-2">
      <NavLink href="/" name="Stron główna" icon={Home} />
      <List />
    </aside>
  );
}
