import { useRouter } from "next/router";
import {
  CalendarDays,
  Paperclip,
  Edit,
  Trash2,
  CheckSquare,
} from "lucide-react";
import { format, formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { getUserFirstLetters } from "~/lib/utils";

import { api } from "~/utils/api";

type Props = {
  projectId: string;
};

export default function TaskDetails({ projectId }: Props) {
  const router = useRouter();
  const taskId = router.query.taskId as string;
  const query = api.tasks.getById.useQuery(taskId, {
    enabled: typeof taskId === "string",
  });

  return (
    <Sheet
      open={!!router.query.taskId}
      onOpenChange={(value) => {
        if (!value) {
          void router.push(`/projects/${projectId}`);
        }
      }}
    >
      <SheetContent position="right" className="flex flex-col">
        <SheetHeader>
          <div className="flex flex-row items-center justify-between pr-6">
            <div className="flex flex-row items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">
                  {getUserFirstLetters(
                    query.data?.createdBy.name ??
                      query.data?.createdBy.email ??
                      ""
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                dodane{" "}
                {formatDistance(
                  query.data?.createdAt ?? new Date(),
                  new Date(),
                  { locale: pl, addSuffix: true }
                )}
              </span>
            </div>
            {query.data?.dueDate ? (
              <div className="flex flex-row items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                  {format(query.data.dueDate, "dd MMMM YYY", { locale: pl })}
                </span>
              </div>
            ) : null}
          </div>
          <SheetTitle className="mt-5">
            {query.data?.priority === "NONE" ? null : (
              <span
                className={`mr-2 inline-block h-3 w-3 rounded-full ${
                  query.data?.priority === "LOW"
                    ? "bg-green-600"
                    : query.data?.priority === "MID"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              ></span>
            )}
            {query.data?.name}
          </SheetTitle>
          <Separator />
          <div className="flex flex-row items-center justify-between">
            {query.data?.assignedTo ? (
              <div>
                <span className="relative mb-1 inline-block rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-xs font-semibold">
                  Przypisane do:
                </span>
                <div className="flex flex-row items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">
                      {getUserFirstLetters(
                        query.data.assignedTo.name ??
                          query.data.assignedTo.email ??
                          ""
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <small className="text-sm font-medium leading-none">
                    {query.data.assignedTo.name ??
                      query.data.assignedTo.email ??
                      ""}
                  </small>
                </div>
              </div>
            ) : null}
            <div className="h-0 w-0"></div>
            <div>
              <Button variant="ghost" className="h-7 w-7 p-0">
                <CheckSquare className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="h-7 w-7 p-0">
                <Edit className="h-5 w-5" />
              </Button>
              <Button variant="ghost" className="h-7 w-7 p-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="files">
              <AccordionTrigger className="py-2">Pliki</AccordionTrigger>
              <ScrollArea className="pr-4">
                <div className="max-h-32">
                  <AccordionContent></AccordionContent>
                </div>
              </ScrollArea>
            </AccordionItem>
          </Accordion>
        </SheetHeader>
        <div className="mt-4 flex flex-1 flex-col overflow-auto">
          <ScrollArea className="pr-4">
            {query.data?.description?.length !== 0 ? (
              <SheetDescription className="whitespace-break-spaces">
                {query.data?.description}
              </SheetDescription>
            ) : null}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
