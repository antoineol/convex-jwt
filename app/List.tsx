"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function List() {
    const tasks = useQuery(api.tasks.get);
    return <div>
        <ul>
            {tasks?.map(({ _id, text, isCompleted }) => <li key={_id}>{isCompleted ? "✅" : "❌"} {text}</li>)}
        </ul>
    </div>
}