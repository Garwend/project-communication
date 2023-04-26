import Link from "next/link";
import { useRouter } from "next/router";
import { Home } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";

export default function Sidebar() {
  const router = useRouter();

  return (
    <aside className="h-[calc(100vh-3rem)] w-52 overflow-auto border-r border-border bg-background p-2">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "hover:underline")}
                active={router.pathname === "/"}
              >
                <Home className="mr-2 h-4 w-4" />
                Strona główna
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
}
