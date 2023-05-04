import { formatDistance } from "date-fns";
import { pl } from "date-fns/locale";
import { Clock4 } from "lucide-react";
import { Paperclip } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "~/components/ui/card";
import WaitingForDetails from "./WaitingForDetails";

type Props = {
  id: string;
  name: string;
  description: string;
  date: Date;
};

export default function WaitingForItem({ id, name, description, date }: Props) {
  return (
    <Card className="mb-2">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="truncate whitespace-break-spaces">
          {description}
        </CardDescription>
        <div className="inline-flex flex-row-reverse items-center gap-1 text-xs text-muted-foreground">
          <Clock4 className="inline-block h-3 w-3" />
          {formatDistance(date, new Date(), { locale: pl, addSuffix: true })}
        </div>
      </CardHeader>
      <CardFooter>
        <WaitingForDetails id={id} />
        <Button className="ml-2" variant="outline">
          <Paperclip className="mr-2 h-4 w-4" /> Dodaj Załącznik
        </Button>
      </CardFooter>
    </Card>
  );
}
