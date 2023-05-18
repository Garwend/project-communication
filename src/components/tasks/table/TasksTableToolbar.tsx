import { Button } from "~/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function TasksTableToolbar() {
  return (
    <section className="mb-2 flex flex-row gap-2">
      <Button variant="outline" size="sm" className="h-8 border-dashed">
        <PlusCircle className="mr-2 h-4 w-4" />
        <span>Projekt</span>
      </Button>
      <Button variant="outline" size="sm" className="h-8 border-dashed">
        <PlusCircle className="mr-2 h-4 w-4" />
        <span>Status</span>
      </Button>
      <Button variant="outline" size="sm" className="h-8 border-dashed">
        <PlusCircle className="mr-2 h-4 w-4" />
        <span>Priorytet</span>
      </Button>
    </section>
  );
}
