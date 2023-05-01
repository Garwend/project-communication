import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  ChevronsUpDown,
  Circle,
  CheckCircle2,
  PauseCircle,
  ArrowRightCircle,
  Ban,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "~/components/ui/dropdown-menu";
import EditProject from "./EditProject";
import DeleteProject from "./DeleteProject";
import LeaveProject from "./LeaveProject";

type Props = {
  id: string;
  ownerId: string;
};

export default function ProjectOptions({ id, ownerId }: Props) {
  const { data: session } = useSession();
  const [position, setPosition] = useState("NONE");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="px-0">
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        {session?.user.id === ownerId ? <EditProject id={id} /> : null}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Circle className="mr-2 h-4 w-4" />
            <span>Status</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem value="NONE">
                  <Circle className="mr-2 h-4 w-4" />
                  <span>Brak</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="IN_PROGRESS">
                  <ArrowRightCircle className="mr-2 h-4 w-4" />
                  <span>W trakcie</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="COMPLETED">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  <span>Ukończony</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="SUSPENDED">
                  <PauseCircle className="mr-2 h-4 w-4" />
                  <span>Wstrzymany</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="CANCELLED">
                  <Ban className="mr-2 h-4 w-4" />
                  <span>Anulowany</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        {session?.user.id === ownerId ? <DeleteProject id={id} /> : null}
        {session?.user.id !== ownerId ? <LeaveProject id={id} /> : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
