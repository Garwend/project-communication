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
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "~/components/ui/dropdown-menu";
import { toastError } from "~/components/ui/toast";
import EditProject from "./EditProject";
import DeleteProject from "./DeleteProject";
import LeaveProject from "./LeaveProject";
import { api, type RouterOutputs } from "~/utils/api";

type Props = {
  id: string;
  ownerId: string;
  status: Status;
};

type Status = RouterOutputs["projects"]["getById"]["status"];

export default function ProjectOptions({ id, ownerId, status }: Props) {
  const { data: session } = useSession();
  const utils = api.useContext();
  const mutation = api.projects.changeStatus.useMutation({
    onSuccess() {
      void utils.projects.getById.refetch(id);
    },
    onError() {
      toastError("Nie udało sie zmienić statusu");
    },
  });

  const handleValueChange = (value: Status) => {
    mutation.mutate({ status: value, id: id });
  };

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
                value={status}
                onValueChange={(value) => handleValueChange(value as Status)}
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
