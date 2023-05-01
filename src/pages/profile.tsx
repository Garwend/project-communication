import { useSession } from "next-auth/react";
import { z, type ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { toastError } from "~/components/ui/toast";

import { getUserFirstLetters } from "~/lib/utils";

import { api } from "~/utils/api";

type FormData = {
  name: string;
};

const schema: ZodType<FormData> = z.object({
  name: z
    .string()
    .min(1, { message: "To pole nie może być puste" })
    .max(64, { message: "Maksymalna długość to 64 znaki" }),
});

export default function Profile() {
  const { update, data: session } = useSession();

  const query = api.users.getCurrentUser.useQuery(undefined, {
    refetchOnWindowFocus: false,
    onSuccess(data) {
      reset({ name: data?.name ?? "" });
    },
  });

  const mutation = api.users.updateUser.useMutation({
    async onSuccess(data) {
      reset({ name: data.name ?? "" });
      await update();
    },
    onError() {
      toastError("Nie udało się zaktualizować twoich danych");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data, e) => {
    e?.preventDefault();
    mutation.mutate(data);
  });

  if (query.isLoading) {
    return (
      <div className="flex w-full justify-center">
        <Skeleton className="h-[650px] w-[650px]" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="flex w-full justify-center"
    >
      <Card className="w-[650px]">
        <CardHeader>
          <CardTitle>Konto</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <Avatar className="h-20 w-20 self-center">
            <AvatarImage src="" />
            <AvatarFallback className="text-xl">
              {getUserFirstLetters(
                session?.user.name ?? session?.user.email ?? ""
              )}
            </AvatarFallback>
          </Avatar>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Nazwa</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name?.message}</p>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              disabled
              defaultValue={query.data?.email ?? ""}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={mutation.isLoading || !isDirty}>
            Zapisz
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
