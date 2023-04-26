import { type ReactNode } from "react";
import { useSession } from "next-auth/react";

import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <Header />
        <main className="mt-12 flex flex-1">
          <Sidebar />
          <section className="flex-auto overflow-auto bg-background p-2">
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
