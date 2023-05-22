import { type ReactNode } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import MessageNotify from "./MessageNotify";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <>
        {!router.pathname.startsWith("/chat") ? (
          <MessageNotify userId={session.user.id} />
        ) : null}
        <Header />
        <main className="mt-12 flex h-[calc(100vh-3rem)] flex-1">
          <Sidebar />
          <section className="h-full flex-auto bg-background p-2">
            {children}
          </section>
        </main>
      </>
    );
  }

  return (
    <main className="flex h-screen">
      <section className="flex flex-auto items-center justify-center overflow-auto bg-background p-2">
        {children}
      </section>
    </main>
  );
}
