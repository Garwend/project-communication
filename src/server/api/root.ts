import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { userRouter } from "./routers/users";
import { projectRouter } from "./routers/projects";
import { inviteRouter } from "./routers/invites";
import { projectStageRouter } from "./routers/project-stages";
import { fileRouter } from "./routers/files";
import { waitingForRouter } from "./routers/waiting-for";
import { answerRouter } from "./routers/answers";
import { tasksRouter } from "./routers/tasks";
import { commentsRouter } from "./routers/comments";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  users: userRouter,
  projects: projectRouter,
  invites: inviteRouter,
  projectStages: projectStageRouter,
  files: fileRouter,
  waitingFor: waitingForRouter,
  answers: answerRouter,
  tasks: tasksRouter,
  comments: commentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
