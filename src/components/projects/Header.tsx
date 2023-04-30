import CreateProject from "./CreateProject";
import InvitesList from "~/components/invites/InvitesList";

export default function Header() {
  return (
    <div className="flex flex-row items-center justify-between pl-4">
      <InvitesList />
      <div className="flex flex-row items-center justify-between gap-2">
        <CreateProject />
      </div>
    </div>
  );
}
