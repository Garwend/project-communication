import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import CreateProjectStage from "./CreateProjectStage";
import ProjectStageHistory from "./ProjectStageHistory";
import CustomLinkify from "~/components/ui/custom-linkify";

import { api } from "~/utils/api";

type Props = {
  id: string;
};

export default function ProjectStage({ id }: Props) {
  const utils = api.useContext();

  return (
    <Card className="w-11/12">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Etap projektu</CardTitle>
          <div className="flex flex-row items-center gap-2">
            <ProjectStageHistory id={id} />
            <CreateProjectStage
              id={id}
              stage={utils.projects.getById.getData(id)?.stages[0]?.stage ?? ""}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-48">
        <ScrollArea className="h-full pr-4">
          <p className="whitespace-break-spaces">
            <CustomLinkify>
              {utils.projects.getById.getData(id)?.stages[0]?.stage}
            </CustomLinkify>
          </p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
