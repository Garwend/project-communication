import { useRouter } from "next/router";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import ProjectStage from "~/components/projects/project-stage/ProjectStage";
import FilesList from "~/components/files/FilesList";
import WaitingForList from "~/components/waiting-for/WaitingForList";
import InviteUser from "~/components/invites/InviteUser";
import ProjectOptions from "~/components/projects/ProjectOptions";
import ParticipantsList from "~/components/projects/participants/ParticipantsList";
import Tasks from "~/components/tasks/Tasks";
import { api } from "../../utils/api";

export default function ProjectPage() {
  const id = useRouter().query.id as string;
  const query = api.projects.getById.useQuery(id, {
    retry: false,
    enabled: typeof id === "string",
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.error) {
    return (
      <div>
        <h1>Nie znaleziono projektu</h1>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-10 flex-shrink-0 flex-row items-center justify-between">
        <div className="flex flex-row gap-2">
          <h1 className="truncate text-2xl font-semibold tracking-tight">
            {query.data?.name}
          </h1>
          <ProjectOptions
            id={id}
            ownerId={query.data.ownerId}
            status={query.data.status}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <ParticipantsList id={id} />
          <InviteUser id={id} ownerId={query.data.ownerId} />
        </div>
      </header>
      <Separator className="mb-4 mt-2" />
      <ScrollArea>
        <div className="flex flex-row">
          <section className="flex-[0_0_60%]">
            <p>{query.data?.description}</p>
            <Tasks id={id} project={query.data} />
          </section>
          <section className="flex flex-[0_0_40%] flex-col items-center gap-4">
            <ProjectStage id={id} />
            <FilesList id={id} />
            <WaitingForList id={id} />
          </section>
        </div>
      </ScrollArea>
    </div>
  );
}
