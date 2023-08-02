import { useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import ProjectTitle from "~/components/projects/ProjectTitle";
import ProjectStage from "~/components/projects/project-stage/ProjectStage";
import FilesList from "~/components/files/FilesList";
import WaitingForList from "~/components/waiting-for/WaitingForList";
import InviteUser from "~/components/invites/InviteUser";
import ProjectOptions from "~/components/projects/ProjectOptions";
import ParticipantsList from "~/components/projects/participants/ParticipantsList";
import Tasks from "~/components/tasks/Tasks";
import ErrorMessage from "~/components/ui/error-message";
import MessageBox from "~/components/chat/MessageBox";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Send, LayoutTemplate, Home } from "lucide-react";
import { api } from "../../../utils/api";

export default function ProjectPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const ref = useRef<HTMLDivElement>(null);
  const query = api.projects.getById.useQuery(id, {
    retry: false,
    enabled: typeof id === "string",
  });

  if (query.isLoading) {
    return <LoadingSkeleton />;
  }

  if (query.error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage message="Nie znaleziono projektu" />
      </div>
    );
  }

  // return (
  //   <div className="flex h-full w-full flex-col">
  //     <header className="flex h-10 flex-shrink-0 flex-row items-center justify-between">
  //       <div className="flex flex-row gap-2">
  //         <ProjectTitle project={query.data} />
  //         <ProjectOptions
  //           id={id}
  //           ownerId={query.data.ownerId}
  //           status={query.data.status}
  //         />
  //       </div>
  //       <div className="flex flex-row items-center gap-4">
  //         <ParticipantsList id={id} />
  //         <InviteUser id={id} ownerId={query.data.ownerId} />
  //       </div>
  //     </header>
  //     <nav className="flex flex-row gap-4">
  //       <Link href={`/projects/${id}`} legacyBehavior>
  //         <a className="inline-flex flex-col items-center">
  //           <div className="inline-flex items-center">
  //             <Home className="mr-2 h-4 w-4" />
  //             <span className="truncate">Projekt</span>
  //           </div>
  //           {router.asPath === `/projects/${id}` ? (
  //             <div className="w-full translate-y-[9px] border-b border-primary"></div>
  //           ) : null}
  //         </a>
  //       </Link>
  //       <Link href={`/projects/${id}/plan`} legacyBehavior>
  //         <a className="inline-flex flex-col items-center">
  //           <div className="inline-flex items-center">
  //             <LayoutTemplate className="mr-2 h-4 w-4" />
  //             <span className="truncate">Plan projektu</span>
  //           </div>
  //           {router.asPath === `/projects/${id}/plan` ? (
  //             <div className="w-full translate-y-[9px] border-b border-primary"></div>
  //           ) : null}
  //         </a>
  //       </Link>
  //     </nav>
  //     <Separator className="mb-2 mt-2" />
  //     <ScrollArea>
  //       <div className="flex flex-col gap-4 pr-4">
  //         <section className="flex flex-row gap-4">
  //           <ProjectStage id={id} />
  //           <FilesList id={id} />
  //           <WaitingForList id={id} />
  //         </section>
  //         <section>
  //           <Tasks id={id} project={query.data} />
  //         </section>
  //         <section className="flex h-[600px] flex-col gap-2 rounded-md border p-2">
  //           <p className="text-lg font-semibold">Czat</p>
  //           <MessageBox projectId={id} scrollBoxRef={ref} />
  //           <section className="flex w-full flex-row items-end gap-2">
  //             <Textarea
  //               placeholder="Wiadomość..."
  //               className="h-10 resize-none transition-all focus:h-24"
  //               disabled={true}
  //             />
  //             <Button className="h-10 w-10 flex-shrink-0 p-0">
  //               <Send className="h-5 w-5" />
  //             </Button>
  //           </section>
  //         </section>
  //       </div>
  //     </ScrollArea>
  //   </div>
  // );

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-10 flex-shrink-0 flex-row items-center justify-between">
        <div className="flex flex-row gap-2">
          <ProjectTitle project={query.data} />
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
      <nav className="flex flex-row gap-4">
        <Link href={`/projects/${id}`} legacyBehavior>
          <a className="inline-flex flex-col items-center">
            <div className="inline-flex items-center">
              <Home className="mr-2 h-4 w-4" />
              <span className="truncate">Projekt</span>
            </div>
            {router.asPath === `/projects/${id}` ? (
              <div className="w-full translate-y-[9px] border-b border-primary"></div>
            ) : null}
          </a>
        </Link>
        <Link href={`/projects/${id}/plan`} legacyBehavior>
          <a className="inline-flex flex-col items-center">
            <div className="inline-flex items-center">
              <LayoutTemplate className="mr-2 h-4 w-4" />
              <span className="truncate">Plan projektu</span>
            </div>
            {router.asPath === `/projects/${id}/plan` ? (
              <div className="w-full translate-y-[9px] border-b border-primary"></div>
            ) : null}
          </a>
        </Link>
      </nav>
      <Separator className="mb-2 mt-2" />
      <ScrollArea>
        <div className="flex flex-row">
          <section className="flex-[0_0_60%]">
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

function LoadingSkeleton() {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex h-10 flex-shrink-0 flex-row items-center justify-between">
        <Skeleton className="h-9 w-24" />
        <div className="flex flex-row -space-x-3">
          <Skeleton className="z-[1] h-9 w-9 rounded-full border border-background" />
          <Skeleton className="z-[1] h-9 w-9 rounded-full border border-background" />
          <Skeleton className="z-[1] h-9 w-9 rounded-full border border-background" />
        </div>
      </div>
      <Separator className="mb-2 mt-2" />
      <div className="flex flex-1">
        <section className="flex flex-[0_0_60%] flex-row justify-between gap-4">
          <Skeleton className="h-full flex-1" />
          <Skeleton className="h-full flex-1" />
          <Skeleton className="h-full flex-1" />
        </section>
        <section className="flex flex-[0_0_40%] flex-col items-center gap-4">
          <Skeleton className="w-11/12 flex-1" />
          <Skeleton className="w-11/12 flex-1" />
          <Skeleton className="w-11/12 flex-1" />
        </section>
      </div>
    </div>
  );
}
