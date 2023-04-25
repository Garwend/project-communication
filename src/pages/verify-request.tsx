import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";

export default function VerifyRequest() {
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
