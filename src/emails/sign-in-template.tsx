import * as React from "react";
import { Heading } from "@react-email/heading";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";
import { Button } from "@react-email/button";
import { Html } from "@react-email/html";

type Props = {
  url: string;
  register: boolean;
};

export default function SignInTemplate({ url, register }: Props) {
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Heading style={title}>
            {register ? "Rejestracja" : "Logowanie"}
          </Heading>
          <Section style={section}>
            <Text>
              {register
                ? "Zarejestruj się klikając w poniższy przycisk"
                : "Zaloguj się klikając w poniższy przycisk"}
            </Text>
            <Button
              pX={20}
              pY={12}
              href={url}
              style={{
                fontWeight: "500",
                background: "#000",
                color: "#fff",
                borderRadius: "0.5rem",
              }}
            >
              {register ? "Zarejestruj się" : "Zaloguj się"}
            </Button>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
};

const title = {
  fontFamily:
    'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  textAlign: "center" as const,
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center" as const,
};
