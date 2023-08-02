import Menu from "./Menu";
import SearchDialog from "./SearchDialog";
import MobileSidebar from "./MobileSidebar";

export default function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 flex h-12 flex-row items-center justify-between gap-4 border-b border-border bg-background px-2 lg:flex-row-reverse">
      <MobileSidebar />
      <div className="flex flex-row items-center gap-4">
        <SearchDialog />
        <Menu />
      </div>
    </header>
  );
}
