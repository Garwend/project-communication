import { useState } from "react";
import { z, type ZodType } from "zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "~/components/ui/input";
import { Mail } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Icons } from "~/components/ui/icons";
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const onSubmit = handleSubmit(async (data, e) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      await signIn("email", { email: data.email });
    } catch {
      setError("email", { type: "custom", message: "nie udało się zalogować" });
    }
    setIsLoading(false);
  });

  return (
    <Card className="w-[350px]">
      <CardHeader className="pb-0">
        <CardTitle className="text-2xl">Zaloguj się</CardTitle>
        <CardDescription>
          Podaj swój email żeby się zalogować jeśli nie masz konta zostaniesz
          zarejestrowany.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={(e) => void onSubmit(e)}>
          <Input type="email" placeholder="Email" {...register("email")} />
          <p className="mt-1 h-5 text-sm text-destructive">
            {errors.email?.message}
          </p>
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Mail className="mr-2 h-4 w-4" />
            Zaloguj
          </Button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Lub
            </span>
          </div>
        </div>
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          onClick={() => {
            setIsGoogleLoading(true);
            void signIn("google");
          }}
          disabled={isLoading || isGoogleLoading}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </CardContent>
    </Card>
  );
}
