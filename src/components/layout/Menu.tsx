import { useEffect } from "react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { LogOut, User, Moon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Switch } from "../ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const darkModeAtom = atomWithStorage("darkMode", false);

export default function Menu() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src="" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" /> Profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleDarkMode}>
          <Moon className="mr-2 h-4 w-4" />
          Tryb ciemny
          <Switch checked={darkMode} className="ml-6" />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          Wyloguj
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
