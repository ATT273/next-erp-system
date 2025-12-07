import type { Metadata } from "next";
import Sidebar from "@/components/layouts/sidebar";

export const metadata: Metadata = {
  title: "CRM NextJS",
  description: "Product of ATT273",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased pl-[15rem] h-dvh">
      <Sidebar />
      {children}
    </div>
  );
}
