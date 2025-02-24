import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ✅ CreateUser: Insert user if not exists and return full user object.
export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uuid: v.string(),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase(); // Ensure emails are stored lowercase.
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), email))
      .unique();

    if (!existingUser) {
      const newUserId = await ctx.db.insert("users", {
        name: args.name,
        email,
        picture: args.picture,
        uuid: args.uuid,
        token: 50000, // Default tokens for new users.
      });
      return {
        _id: newUserId,
        name: args.name,
        email,
        picture: args.picture,
        token: 50000,
      };
    }

    return existingUser;
  },
});

// ✅ GetUser: Fetch user by email.
export const GetUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return (
      (await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("email"), args.email.toLowerCase()))
        .unique()) || null
    );
  },
});

// ✅ UpdateToken: Deduct tokens (for AI usage)
export const UpdateToken = mutation({
  args: { userId: v.id("users"), token: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error(`User with ID ${args.userId} not found.`);
    }
    if (user.token < args.token) {
      throw new Error("Not enough tokens.");
    }
    const newTokenCount = user.token - args.token;
    await ctx.db.patch(args.userId, { token: newTokenCount });
    return { token: newTokenCount };
  },
});

// ✅ AddTokens: Add tokens after payment.
export const AddTokens = mutation({
  args: { userId: v.id("users"), tokensToAdd: v.number() },
  handler: async (ctx, args) => {
    if (args.tokensToAdd <= 0) {
      throw new Error("Invalid token amount. Must be greater than zero.");
    }
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error(`User with ID ${args.userId} not found.`);
    }
    const newTokenCount = (Number(user.token) || 0) + args.tokensToAdd;
    await ctx.db.patch(args.userId, { token: newTokenCount });
    // Return an object with the updated token count.
    return { token: newTokenCount };
  },
});
