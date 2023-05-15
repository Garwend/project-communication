import {
  CalendarDays,
  Circle,
  CheckCircle2,
  PauseCircle,
  ArrowRightCircle,
  Ban,
} from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { type RouterOutputs } from "~/utils/api";

type Project = RouterOutputs["projects"]["getById"];

type Props = {
  project: Project;
};

export default function ProjectTitle({ project }: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <h1 className="cursor-pointer truncate text-2xl font-semibold tracking-tight hover:underline">
          {project.name}
        </h1>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className={`flex flex-col gap-2 break-words ${
          project.description && project.description.length > 100 ? "w-96" : ""
        }`}
      >
        <div className="flex flex-row items-center gap-1">
          {project.status === "NONE" ? (
            <Circle className="h-5 w-5 text-primary" />
          ) : project.status === "IN_PROGRESS" ? (
            <ArrowRightCircle className="h-5 w-5 text-primary" />
          ) : project.status === "COMPLETED" ? (
            <CheckCircle2 className="h-5 w-5 text-primary" />
          ) : project.status === "CANCELLED" ? (
            <Ban className="h-5 w-5 text-primary" />
          ) : (
            <PauseCircle className="h-5 w-5 text-primary" />
          )}
          <h4 className="text-sm font-semibold">{project.name}</h4>
        </div>
        <p>{project.description}</p>
        <div className="flex flex-row items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">
            utworzono {format(project.createdAt, "dd MMMM YYY", { locale: pl })}
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
