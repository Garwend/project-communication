import { useRouter } from "next/router";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "~/components/ui/card";

import { Button } from "~/components/ui/button";

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  if (error === "Verification") {
    return (
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center">Nie udało się zalogować</CardTitle>
          <CardDescription className="text-center">
            Link wygasł lub został już wykorzystany.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" passHref legacyBehavior>
            <Button className="w-full">Panel logowania</Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-center">Wystąpił błąd</CardTitle>
      </CardHeader>
    </Card>
  );
}
