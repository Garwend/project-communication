import { Paperclip, MessageCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "~/components/ui/card";

export default function WaitingForItem() {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>Wzory dokuentów</CardTitle>
        <CardDescription>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Saepe, nisi.
          Est et doloribus voluptatem ipsum quas, laborum recusandae modi!
          Expedita cumque explicabo corrupti a repellat commodi soluta totam rem
          laudantium?
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button>
          <MessageCircle className="mr-2 h-4 w-4" /> Odpowiedz
        </Button>
        <Button className="ml-2" variant="outline">
          <Paperclip className="mr-2 h-4 w-4" /> Dodaj Załącznik
        </Button>
      </CardFooter>
    </Card>
  );
}
