import { useChannel } from "@ably-labs/react-hooks";
import { toastMessage } from "~/components/ui/toast";

type Props = {
  userId: string;
};

type Message = {
  message: string;
  name: string;
};

export default function MessageNotify({ userId }: Props) {
  useChannel(userId, "notify-message", (message) => {
    const data = message.data as Message;
    toastMessage(data.message, data.name);
  });

  return <></>;
}
