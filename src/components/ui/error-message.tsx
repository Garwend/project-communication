import { XOctagon } from "lucide-react";

type Props = {
  message: string;
};

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="flex min-h-[150px] max-w-sm flex-col items-center justify-around gap-2 rounded-md border p-4 text-center">
      <XOctagon className="h-12 w-12 text-center text-destructive" />
      <h3 className="text-center text-3xl font-semibold tracking-tight">
        {message}
      </h3>
    </div>
  );
}
