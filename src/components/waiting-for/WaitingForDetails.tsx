import { MessageCircle, Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "~/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Input } from "~/components/ui/input";
import DeleteWaitingFor from "./DeleteWaitingFor";

import { api } from "~/utils/api";

type Props = {
  id: string;
};

export default function WaitingForDetails({ id }: Props) {
  const query = api.waitingFor.getById.useQuery(id);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <MessageCircle className="mr-2 h-4 w-4" /> Odpowiedz
        </Button>
      </SheetTrigger>
      <SheetContent position="right" className="flex flex-col">
        <SheetHeader>
          <div className="mt-5 flex flex-row items-center justify-between">
            <SheetTitle>{query.data?.name}</SheetTitle>
            <DeleteWaitingFor id={id} />
          </div>

          <ScrollArea className="pr-4">
            <div className="max-h-48">
              <SheetDescription>{query.data?.description}</SheetDescription>
            </div>
          </ScrollArea>
          <Accordion type="single" collapsible>
            <AccordionItem value="files">
              <AccordionTrigger>Pliki</AccordionTrigger>
              <AccordionContent>Plik</AccordionContent>
            </AccordionItem>
          </Accordion>
        </SheetHeader>
        <div className="flex-1"></div>
        <SheetFooter className="gap-2">
          <Input placeholder="Odpowiedz..." />
          <Button className="h-10 w-10 flex-shrink-0 p-0">
            <Send className="h-5 w-5" />
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
