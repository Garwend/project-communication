import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import WaitingForItem from "./WaitingForItem";

export default function WaitingForList() {
  return (
    <Card className="w-3/4">
      <CardHeader>
        <CardTitle>Oczekiwanie na:</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ScrollArea className="h-full pr-4">
          <WaitingForItem />
          <WaitingForItem />
          <WaitingForItem />
          <WaitingForItem />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
