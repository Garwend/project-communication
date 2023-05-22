import toast from "react-hot-toast";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getUserFirstLetters } from "~/lib/utils";

const toastMessage = (message: string, name: string) =>
  toast.custom(() => (
    <div
      className={`pointer-events-auto flex w-full max-w-md rounded-md border bg-background p-4`}
    >
      <Avatar className="h-16 w-16">
        <AvatarImage src="" />
        <AvatarFallback>{getUserFirstLetters(name)}</AvatarFallback>
      </Avatar>
      <div className="ml-4 flex-1 truncate">
        <h4 className="text-md truncate font-semibold tracking-tight">
          {name}
        </h4>
        <p className="mt-2 w-full truncate text-sm text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  ));

const toastError = (message: string) => toast.error(message);
const toastSuccess = (message: string) => toast.success(message);

export { toastError, toastSuccess, toastMessage };
