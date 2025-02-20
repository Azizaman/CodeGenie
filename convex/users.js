import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ✅ Creates user if not exists
export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uuid: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (user.length === 0) {
      await ctx.db.insert("users", {
        name: args.name,
        picture: args.picture,
        email: args.email,
        uuid: args.uuid,
        token: 50000,
      });
    }
  },
});

// ✅ Fetches user by email safely
export const GetUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();
    return user[0] || null; // ✅ Returns `null` if user not found
  },
});

// ✅ Updates user token safely
export const UpdateToken = mutation({
  args: { token: v.number(), userId: v.id("users") },
  handler: async (ctx, args) => {
    return ctx.db.patch(args.userId, { token: args.token });
  },
});

























// import { v } from "convex/values";
// import { mutation, query } from "./_generated/server";

// // Handler
// export const CreateUser = mutation({
//     args: {
//         name: v.string(),
//         email: v.string(),
//         picture: v.string(),
//         uuid: v.string(), // Updated field name
//     },
//     handler: async (ctx, args) => {
//         const user = await ctx.db.query("users").filter((q) => q.eq(q.field("email"), args.email)).collect();
//         console.log(user);
//         if (user?.length == 0) {
//             const result = await ctx.db.insert("users", {
//                 name: args.name,
//                 picture: args.picture,
//                 email: args.email,
//                 uuid: args.uuid, // No changes
//                 token:50000
//             });
//             console.log(result);
//         }
//     },
// });

// export const GetUser=query({
//     args:{
//         email:v.string(),
//     },
//     handler:async (ctx, args) => {
//         const user = await ctx.db.query("users").filter((q) => q.eq(q.field("email"), args.email)).collect();
//         return user[0];

//     }
// })




// export const UpdateToken = mutation({
//   args: {
//     token: v.number(),
//     userId: v.id("users"),
//   },
//   handler: async (ctx, args) => {
//     // ✅ Ensure `ctx.db` is available before using it
//     if (!ctx.db) {
//       throw new Error("Database context (ctx.db) is undefined.");
//     }

//     const user = await ctx.db.get(args.userId);
    
//     if (!user) {
//       throw new Error(`User not found with ID: ${args.userId}`);
//     }

//     return ctx.db.patch(args.userId, {
//       token: args.token,
//     });
//   },
// });


  

// export const UpdateToken=mutation({
//     args:{
//         token:v.number(),
//         userId:v.id('users')
//     },
//     handler:async(ctx,args)=>{
//         const result=await ctx.db.patch(args.userId,{
//             token:args.token
//         });
//         return result;
//     }
// })