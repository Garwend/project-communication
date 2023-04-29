import { useRouter } from "next/router";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "../../utils/api";

export default function ProjectPage() {
  const id = useRouter().query.id as string;
  const query = api.projects.getById.useQuery(id, { retry: false });

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
    <ScrollArea className="h-full">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          {query.data?.name}
        </h1>
      </header>
      <Separator className="my-4" />
      <section className="flex flex-row">
        <section className="flex-[0_0_50%]">
          <p>{query.data?.description}</p>
        </section>
        <section className="flex-[0_0_50%]"></section>
      </section>
    </ScrollArea>
  );
}
