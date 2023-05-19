import Menu from "./Menu";
import SearchDialog from "./SearchDialog";

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 flex h-12 flex-row-reverse items-center gap-4 border-b border-border bg-background pr-2">
      <Menu />
      <SearchDialog />
    </header>
  );
}
