import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";

export default function ProjectStage() {
  return (
    <Card className="w-3/4">
      <CardHeader>
        <CardTitle>Etap projektu</CardTitle>
      </CardHeader>
      <CardContent className="h-48">
        <ScrollArea className="h-full pr-4">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
            debitis dolores cum repellat reprehenderit laudantium fugit hic
            voluptas odio, est quia illo amet, odit, ea eos consequatur aliquid
            accusamus? Enim. Lorem ipsum dolor sit, amet consectetur adipisicing
            elit. Voluptas asperiores aut aliquam mollitia. Sapiente autem quae
            distinctio repellat. Eveniet, sint sapiente saepe ipsum tempore
            accusamus quos odio aliquam fugiat animi! Lorem ipsum dolor, sit
            amet consectetur adipisicing elit. Quod quaerat minima iste nobis
            incidunt nisi explicabo tenetur quidem. Modi nihil nobis distinctio
            illo blanditiis, aspernatur quibusdam excepturi impedit. Corrupti,
            praesentium!
          </p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
