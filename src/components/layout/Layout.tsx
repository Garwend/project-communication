import { type ReactNode } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
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
