import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const auth = await ctx.auth.getUserIdentity();
    console.log('auth:', auth); // null

    return await ctx.db.query("tasks").collect();
  },
});