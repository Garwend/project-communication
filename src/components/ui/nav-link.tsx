import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { useRouter } from "next/router";
import { navigationMenuTriggerStyle } from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";

type Props = {
  name: string;
  href: string;
  icon?: LucideIcon;
};

export function NavLink({ name, href, icon: Icon }: Props) {
  const router = useRouter();

  return (
    <Link href={href} legacyBehavior>
      <a
        data-active={router.pathname === href ? true : null}
        className={cn(
          navigationMenuTriggerStyle(),
          "flex w-full justify-start hover:underline"
        )}
      >
        {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
        <span className="truncate">{name}</span>
      </a>
    </Link>
  );
}
