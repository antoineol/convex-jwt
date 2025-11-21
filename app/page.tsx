"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <ul>
          {tasks?.map(({ _id, text, isCompleted }) => <li key={_id}>{isCompleted ? "✅" : "❌"} {text}</li>)}
        </ul>
      </main>
    </div>
  );
}
