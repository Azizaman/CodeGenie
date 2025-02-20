import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uuid: v.string(),
    token: v.optional(v.number()), // ✅ Token is optional
  }),
  workspace: defineTable({
    messages: v.any(),
    fileData: v.optional(v.any()), // ✅ Ensure fileData is optional
    user: v.id("users"),
  }),
});



















// import { defineSchema, defineTable } from "convex/server";
// import {v} from 'convex/values'

// // Schema remains unchanged
// export default defineSchema({
//     users: defineTable({
//         name: v.string(),
//         email: v.string(),
//         picture: v.string(),
//         uuid: v.string(), // No changes
//         token:v.optional(v.number())
//     }),
//     workspace:defineTable({
//         messages:v.any(),
//         fileData:v.optional(v.any()),
//         user:v.id('users')


    
//     })
// });


