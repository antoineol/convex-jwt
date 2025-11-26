This repo is a minimal reproduction of a convex issue about custom JWT auth: [https://github.com/get-convex/convex-js/issues/108](https://github.com/get-convex/convex-js/issues/108)

It uses convex cloud dev env.

## Getting Started

```bash
git clone https://github.com/antoineol/convex-jwt.git
cd convex-jwt
git checkout loop-refetch
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000) and notice it's continuously fetching the token.

Now, go to branch "experiment" that uses `convex.setAuth` instead of `ConvexProviderWithAuth`, and now it works.

Note: `.env.local` is versioned on purpose, so that you have the full environment to reproduce the issue.
