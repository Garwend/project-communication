import Header from "./Header";
import { Separator } from "~/components/ui/separator";
import { NavLink } from "~/components/ui/nav-link";
import { Skeleton } from "~/components/ui/skeleton";

import { api } from "~/utils/api";

export default function List() {
  const query = api.projects.getAll.useQuery(undefined);

  return (
    <section>
      <Separator className="my-4" />
      <Header />
      <div className="mt-4 flex flex-col">
        {query.isLoading ? <SkeletonProjectList /> : null}
        {query.data
          ? query.data.map((project) => (
              <NavLink
                key={project.id}
                name={project.name}
                href={`/projects/${project.id}`}
              />
            ))
          : null}
      </div>
    </section>
  );
}

function SkeletonProjectList() {
  return (
    <>
      <Skeleton className="mb-2 h-8 w-full" />
      <Skeleton className="mb-2 h-8 w-full" />
      <Skeleton className="mb-2 h-8 w-full" />
      <Skeleton className="mb-2 h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </>
  );
}
