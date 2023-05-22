import { type KeyboardEvent } from "react";
import { z, type ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { toastError } from "~/components/ui/toast";

import { api } from "~/utils/api";

type Props = {
  projectId: string;
};

type FormData = {
  text: string;
};

const schema: ZodType<FormData> = z.object({
  text: z.string().trim().min(1),
});

export default function SendMessage({ projectId }: Props) {
  const utils = api.useContext();

  const mutation = api.chat.createMessage.useMutation({
    onSuccess() {
      reset();
      void utils.chat.getMessages.invalidate(projectId);
    },
    onError() {
      toastError("Nie udało sie wysłać wiadomości");
    },
  });
  const { register, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      void onSubmit();
    }
  };

  const onSubmit = handleSubmit((data, e) => {
    e?.preventDefault();
    mutation.mutate({
      text: data.text,
      projectId: projectId,
    });
  });

  return (
    <form
      className="flex w-full flex-row items-end gap-2"
      onSubmit={(e) => void onSubmit(e)}
    >
      <Textarea
        placeholder="Wiadomość..."
        {...register("text")}
        className="h-10 resize-none transition-all focus:h-24"
        onKeyDown={handleKeyDown}
      />
      <Button className="h-10 w-10 flex-shrink-0 p-0" type="submit">
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
