import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import FileItem from "./FileItem";

export default function FilesList() {
  return (
    <Card className="w-3/4">
      <CardHeader>
        <CardTitle>Przesłane pliki</CardTitle>
      </CardHeader>
      <CardContent className="h-48">
        <ScrollArea className="h-full pr-4">
          <FileItem name="logo" type="image" />
          <FileItem name="regulamin" />
          <FileItem name="logo 2" type="image" />
          <FileItem name="polityka prywatności" />
          <FileItem name="szablon" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
