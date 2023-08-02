import { NavLink } from "../ui/nav-link";
import { Button } from "../ui/button";
import { Menu, Home, MessageCircle } from "lucide-react";
import {
  Sheet,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from "../ui/sheet";
import { Separator } from "~/components/ui/separator";
import List from "~/components/projects/List";

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="sm" variant="ghost" className="lg:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent position="left" size="sm" className="w-3/4 sm:w-64">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2">
          <NavLink href="/" name="Strona główna" icon={Home} />
          <NavLink href="/chat" name="Czat" icon={MessageCircle} />
        </div>
        <List />
      </SheetContent>
    </Sheet>
  );
}
