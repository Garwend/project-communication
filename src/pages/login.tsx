import { z, type ZodType } from "zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

type FormData = {
  email: string;
};

const schema: ZodType<FormData> = z.object({
  email: z
    .string()
    .min(1, { message: "To pole nie może być puste" })
    .email({ message: "Niepoprawny adres email" }),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (data, e) => {
    e?.preventDefault();

    try {
      await signIn("email", { email: data.email });
    } catch {
      setError("email", { type: "custom", message: "nie udało się zalogować" });
    }
  });

  return (
    <form onSubmit={(e) => void onSubmit(e)}>
      <Card className="w-[350px]">
        <CardContent className="pb-2 pt-6">
          <Input type="email" placeholder="Email" {...register("email")} />
          <p className="mt-1 h-5 text-sm text-destructive">
            {errors.email?.message}
          </p>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Zaloguj się
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
