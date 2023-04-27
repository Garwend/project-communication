import { Home } from "lucide-react";
import { NavLink } from "../ui/nav-link";
import List from "~/components/projects/List";

export default function Sidebar() {
  return (
    <aside className="h-[calc(100vh-3rem)] w-52 overflow-auto border-r border-border bg-background p-2">
      <NavLink href="/" name="Stron główna" icon={Home} />
      <List />
    </aside>
  );
}
