import { History, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { ScrollArea } from "~/components/ui/scroll-area";
import CustomLinkify from "~/components/ui/custom-linkify";

import { api } from "~/utils/api";

type Props = {
  id: string;
};

export default function ProjectStageHistory({ id }: Props) {
  const query = api.projectStages.getAll.useQuery(id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="mt-0 h-7 w-7 p-0">
          <History className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent position="right">
        <SheetHeader>
          <SheetTitle>Historia etapów projektu</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full pr-4">
          <div className="mt-8 flex flex-col gap-4 pb-4">
            {query.data?.map((stage) => (
              <div key={stage.id}>
                <div className="flex flex-row gap-2">
                  <CalendarDays />
                  <SheetTitle>
                    {format(stage.createdAt, "dd MMMM YYY", { locale: pl })}
                  </SheetTitle>
                </div>

                <SheetDescription className="whitespace-break-spaces">
                  <CustomLinkify>{stage.stage}</CustomLinkify>
                </SheetDescription>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
