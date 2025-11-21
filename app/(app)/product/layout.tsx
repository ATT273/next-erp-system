import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product | CRM",
  description: "Product of ATT273",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full h-full">{children}</div>;
}
