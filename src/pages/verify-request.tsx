import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function VerifyRequest() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      void router.push("/");
    }
  }, [session, router]);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">Sprawdź swój email</CardTitle>
        <CardDescription className="text-center">
          Link do zalogowania został przesłany na podany przez ciebie mail.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
