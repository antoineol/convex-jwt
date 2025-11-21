"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function List({ jwt }: { jwt: string }) {
    const tasks = useQuery(api.tasks.get);
    return <div>
        <p>JWT: {jwt}</p>
        <ul>
            {tasks?.map(({ _id, text, isCompleted }) => <li key={_id}>{isCompleted ? "✅" : "❌"} {text}</li>)}
        </ul>
    </div>
}