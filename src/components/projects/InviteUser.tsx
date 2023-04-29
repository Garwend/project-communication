import { UserPlus } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function InviteUser() {
  return (
    <Button size="sm">
      <UserPlus className="mr-2 h-4 w-4" /> Zaproś
    </Button>
  );
}
