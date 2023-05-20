import { type PropsWithChildren } from "react";
import Link from "next/link";
import Linkify from "linkify-react";
import { type IntermediateRepresentation } from "linkifyjs";

const renderLink = ({ attributes, content }: IntermediateRepresentation) => {
  const { href, ...props } = attributes;
  return (
    <Link
      href={href as string}
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium hover:underline"
    >
      {content}
    </Link>
  );
};

export default function CustomLinkify({ children }: PropsWithChildren) {
  return <Linkify options={{ render: renderLink }}>{children}</Linkify>;
}
