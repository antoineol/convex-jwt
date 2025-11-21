import { createJWT } from "@/lib/jwt";
import { List } from "./List";

export default async function Home() {
  const jwt = await createJWT({
    sub: "test-user",
    // Additional claims can be added here
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <List jwt={jwt} />
      </main>
    </div>
  );
}
