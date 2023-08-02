import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDebouncedValue } from "@mantine/hooks";
import { Download, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { Button } from "~/components/ui/button";
import { downloadFileFromUrl } from "~/lib/utils";
import { toastError } from "~/components/ui/toast";
import { api } from "~/utils/api";

export default function SearchDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const query = api.search.search.useQuery(debouncedSearch, {
    enabled: search.trim().length > 0,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const openPage = (url: string) => {
    setOpen(false);
    void router.push(url);
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
        className="px-2 sm:px-3"
      >
        <div className="hidden sm:block">
          <span className="mr-8">Szukaj...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">Ctrl k</span>
          </kbd>
        </div>
        <Search className="sm:hidden" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Szukaj..."
          value={search}
          onValueChange={(value) => setSearch(value)}
        />
        <CommandList>
          <CommandEmpty>Brak wyników wyszukiwania</CommandEmpty>
          {query.data ? (
            <>
              {query.data.projects.length > 0 ? (
                <CommandGroup heading="Projekty">
                  {query.data.projects.map((project) => (
                    <CommandItem
                      key={`p-${project.id}`}
                      value={`p-${project.id}`}
                      onSelect={() => openPage(`/projects/${project.id}`)}
                    >
                      <span className="truncate">{project.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {query.data.tasks.length > 0 ? (
                <CommandGroup heading="Zadania">
                  {query.data.tasks.map((task) => (
                    <CommandItem
                      key={`t-${task.id}`}
                      value={`t-${task.id}`}
                      onSelect={() => openPage(`/tasks/${task.id}`)}
                    >
                      <span className="truncate">{task.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
              {query.data.files.length > 0 ? (
                <CommandGroup heading="Pliki">
                  {query.data.files.map((file) => (
                    <CommandItem key={`f-${file.id}`} value={`f-${file.id}`}>
                      <DownloadFileButton
                        id={file.id}
                        projectId={file.projectId}
                        name={file.name}
                      />
                      <span className="truncate">{file.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}

type DownloadFileProps = {
  id: string;
  projectId: string;
  name: string;
};

function DownloadFileButton({ id, projectId, name }: DownloadFileProps) {
  const mutation = api.files.getDownloadS3Url.useMutation({
    onSuccess(data) {
      downloadFileFromUrl(data, name);
    },
    onError() {
      toastError("Nie udało się pobrać pliku");
    },
  });

  return (
    <Button
      variant="secondary"
      className="mr-4 h-7 w-7 flex-shrink-0 p-0"
      onClick={() => mutation.mutate({ id: id, projectId: projectId })}
    >
      <Download className="h-5 w-5" />
    </Button>
  );
}
