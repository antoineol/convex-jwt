import { createJWT, parseJWT } from "@/lib/jwt";
import { List } from "./List";
import { JwtCheck } from "./api/auth/token/JwtCheck";
import { ConvexJwtCheck } from "./api/auth/token/ConvexJwtCheck";

export default async function Home() {
  const jwt = await createJWT({ sub: "test-user" });
  // Throws if the JWT is invalid. It shows that the JWT and JWKS are valid.
  await parseJWT(jwt);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div>
          <JwtCheck />
          <ConvexJwtCheck />
          <hr className="my-8" />
          <List />
        </div>
      </main>
    </div>
  );
}
