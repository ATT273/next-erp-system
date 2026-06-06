import { getSession } from "@/app/actions";
import HomePageAction from "./(app)/_components/HomePageAction";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="relative items-center w-dvw h-dvh">
      <div className="absolute w-full -translate-y-1/2 top-1/2">
        <h1 className="mb-3 text-3xl font-bold text-center">Welcome to Next CRM, {session ? session.name : "Guest"}</h1>
        <div className="flex justify-center w-full">
          <HomePageAction session={session} />
        </div>
      </div>
    </div>
  );
}
