import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ✅ CreateUser: Inserts user if they don't exist
export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uuid: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();

    if (!existingUser) {
      const newUserId = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        picture: args.picture,
        uuid: args.uuid,
        token: 50000, // Default tokens for new users
      });

      return { _id: newUserId, ...args, token: 50000 };
    }

    return existingUser;
  },
});

// ✅ GetUser: Ensures email is always passed
export const GetUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();

    if (!user) {
      throw new Error(`User with email ${args.email} not found.`);
    }
    return user;
  },
});

// ✅ UpdateToken: Used for both deduction and addition
export const UpdateToken = mutation({
  args: { userId: v.id("users"), tokensToAdd: v.number() },
  handler: async (ctx, args) => {
    if (args.tokensToAdd === 0) return; // No change needed

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error(`User not found: ${args.userId}`);

    const newTokenCount = Math.max(0, user.token + args.tokensToAdd); // Ensure no negative balance

    await ctx.db.patch(args.userId, { token: newTokenCount });
    return { newTokens: newTokenCount };
  },
});
