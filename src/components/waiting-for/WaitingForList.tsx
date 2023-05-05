import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";
import WaitingForItem from "./WaitingForItem";
import CreateWaitingFor from "./CreateWaitingFor";

import { api } from "~/utils/api";

type Props = {
  id: string;
};

export default function WaitingForList({ id }: Props) {
  const utils = api.useContext();

  return (
    <Card className="w-3/4">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>Oczekiwanie na:</CardTitle>
          <CreateWaitingFor id={id} />
        </div>
      </CardHeader>
      <CardContent className="h-80">
        {utils.projects.getById.getData(id)?.watitngFor === undefined ||
        utils.projects.getById.getData(id)?.watitngFor.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center">
            <h4 className="select-none truncate text-2xl font-semibold tracking-tight">
              Nic nie zostało jeszcze dodane
            </h4>
          </div>
        ) : (
          <ScrollArea className="h-full pr-4">
            {utils.projects.getById.getData(id)?.watitngFor.map((wf) => (
              <WaitingForItem
                key={wf.id}
                id={wf.id}
                projectId={id}
                name={wf.name}
                date={wf.createdAt}
                delivered={wf.delivered}
              />
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
