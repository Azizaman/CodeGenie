import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Creates a workspace. Requires a valid user ID.
export const CreateWorkspace = mutation({
  args: { messages: v.any(), user: v.id("users") },
  handler: async (ctx, args) => {
    if (!args.user) {
      throw new Error("User ID is required to create a workspace.");
    }
    const workspaceId = await ctx.db.insert("workspace", {
      messages: args.messages,
      user: args.user,
    });
    console.log("New Workspace Created:", workspaceId);
    return workspaceId;
  },
});

export const GetworkspaceData = query({
  args: { workspaceId: v.id("workspace") },
  handler: async (ctx, args) => ctx.db.get(args.workspaceId),
});

export const UpdateMessages = mutation({
  args: { workspaceId: v.id("workspace"), messages: v.any() },
  handler: async (ctx, args) => ctx.db.patch(args.workspaceId, { messages: args.messages }),
});

export const UpdateFiles = mutation({
  args: { workspaceId: v.id("workspace"), files: v.any() },
  handler: async (ctx, args) => ctx.db.patch(args.workspaceId, { fileData: args.files }),
});

export const GetAllworkspace = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) =>
    ctx.db
      .query("workspace")
      .filter((q) => q.eq(q.field("user"), args.userId))
      .collect(),
});









// import { handler } from "tailwindcss-animate";
// import { mutation, query } from "./_generated/server"; // Added query import
// import { v } from "convex/values";


// export const CreateWorkspace = mutation({
//   args: {
//     messages: v.any(),
//     user: v.id("users"), // ✅ Ensure `user` is required
//   },
//   handler: async (ctx, args) => {
//     if (!args.user) {
//       throw new Error("User ID is required to create a workspace.");
//     }

//     return await ctx.db.insert("workspace", {
//       messages: args.messages,
//       user: args.user, // ✅ Ensure `user` is passed
//     });
//   },
// });






// export const CreateWorkspace = mutation({
//   args: {
//     messages: v.any(),
//     user: v.id('users')
//   },
//   handler: async (ctx, args) => {
//     const workspaceId = await ctx.db.insert('workspace', {
//       messages: args.messages,
//       user: args.user
//     });
//     return workspaceId;
//   }
// });

// export const GetworkspaceData  = query({ // Corrected and added query
//   args: {
//     workspaceId: v.id('workspace') // Changed argument name for consistency
//   },
//   handler: async (ctx, args) => {
//     const result = await ctx.db.get(args.workspaceId);
//     return result;
//   }
// })

// export const UpdateMessages = mutation({
//   args: {
//     workspaceId: v.id('workspace'), // Ensure this matches the name in React component
//     messages: v.any()
//   },
//   handler: async (ctx, args) => {
//     const updated = await ctx.db.patch(args.workspaceId, { // Use workspaceId here
//       messages: args.messages
//     });
//     return updated;
//   }
// });


// export const UpdateFiles = mutation({
//   args: {
//     workspaceId: v.id('workspace'), // Ensure this matches the name in React component
//     files: v.any()
//   },
//   handler: async (ctx, args) => {
//     const result = await ctx.db.patch(args.workspaceId, { // Use workspaceId here
//       fileData: args.files
//     });
//     return result;
//   }
// });

// export const GetAllworkspace=query({
//   args:{
//     userId:v.id('users')
//   },
//   handler:async(ctx,args)=>{
//     const result=await ctx.db.query('workspace')
//     .filter(q=>q.eq(q.field('user'),args.userId))
//     .collect();

//     return result;
//   }
// })
