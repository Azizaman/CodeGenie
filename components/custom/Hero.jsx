"use client";
import Lookup from "@/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import React, { useContext, useState } from "react";
import Colors from "@/data/Colors";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SigninDialog from "./SigninDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail } = useContext(UserDetailContext);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  const onGenerate = async (input) => {
    console.log("User Detail:", userDetail); // ✅ Debugging
  
    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }
  
    if (!userDetail?._id) {
      console.error("User ID is missing");
      alert("You need to be logged in to create a workspace.");
      return;
    }
  
    const msg = { role: "user", content: input };
    setMessages((prev) => (Array.isArray(prev) ? [...prev, msg] : [msg]));
  
    try {
      // ✅ Call the mutation and store response
      const response = await CreateWorkspace({ user: userDetail._id, messages: [msg] });
  
      console.log("CreateWorkspace Response:", response); // ✅ Debugging
  
      if (!response || typeof response !== "string") {
        console.error("Error: Invalid workspace response", response);
        alert("Workspace creation failed. Please try again.");
        return;
      }
  
      console.log("Workspace Created:", response);
      router.push(`/workspace/${response}`); // ✅ Ensure correct ID is used
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert("An error occurred while creating the workspace.");
    }
  };
  
  
  return (
    <div className="flex flex-col items-center mt-32 xl:mt-24 gap-2 ml-72">
      <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>
      <div className="p-5 border rounded-xl max-w-xl w-full mt-3" style={{ backgroundColor: Colors.BACKGROUND }}>
        <div className="flex gap-2">
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            onChange={(e) => setUserInput(e.target.value)}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
            value={userInput}
          />
          {userInput && (
            <ArrowRight onClick={() => onGenerate(userInput)} className="bg-blue-500 h-8 w-8 p-2 rounded-md cursor-pointer" />
          )}
        </div>
        <div><Link className="h-5 w-5" /></div>
      </div>
      <SigninDialog openDialog={openDialog} closeDialog={setOpenDialog} />
    </div>
  );
}

export default Hero;





























// "use client";
// import Lookup from "@/data/Lookup";
// import { ArrowRight, Link } from "lucide-react";
// import React, { useContext, useState } from "react";
// import Colors from "@/data/Colors";
// import { MessagesContext } from "@/context/MessagesContext";
// import { UserDetailContext } from "@/context/UserDetailContext";
// import SigninDialog from "./SigninDialog";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { useRouter } from "next/navigation";

//  function Hero() {
//   // Initialize local state for user input and dialog open state.
//   const [userInput, setUserInput] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);

//   // Use the context values.
//   const { messages, setMessages } = useContext(MessagesContext);
//   const { userDetail, setUserDetail } = useContext(UserDetailContext);
//   const CreateWorkspace=useMutation(api.workspace.CreateWorkspace)
//   const router=useRouter();

//   const onGenerate = async (input) => {
//     if (!userDetail?.name) {
//       setOpenDialog(true);
//       return;
//     }
  
//     const msg = {
//       role: "user",
//       content: input,
//     };
  
//     // 🔥 Ensure messages is always an array
//     setMessages((prevMessages) => (Array.isArray(prevMessages) ? [...prevMessages, msg] : [msg]));
  
//     try {
//       // 🔥 Ensure `userDetail._id` exists before calling CreateWorkspace
//       if (!userDetail?._id) {
//         console.error("User ID is missing");
//         alert("You need to be logged in to create a workspace.");
//         return;
//       }
  
//       // 🔥 Create workspace with user ID
//       const response = await CreateWorkspace({
//         user: userDetail._id, // ✅ Pass `user` correctly
//         messages: [msg], // ✅ Ensure messages is always an array
//       });
  
//       if (!response || !response._id) {
//         console.error("Error: Workspace ID not returned", response);
//         alert("Workspace creation failed. Please try again.");
//         return;
//       }
  
//       console.log("Workspace Created:", response);
  
//       // 🔥 Redirect to the new workspace
//       router.push(`/workspace/${response._id}`);
//     } catch (error) {
//       console.error("Error creating workspace:", error);
//       alert("An error occurred while creating the workspace.");
//     }
//   };
  
  

//   return (
//     <div className="flex flex-col items-center mt-32 xl:mt-24 gap-2 ml-72">
//       <h2></h2>
//       <h2 className="font-bold text-4xl">{Lookup.HERO_HEADING}</h2>
//       <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>
//       <div
//         className="p-5 border rounded-xl max-w-xl w-full mt-3"
//         style={{ backgroundColor: Colors.BACKGROUND }}
//       >
//         <div className="flex gap-2">
//           <textarea
//             placeholder={Lookup.INPUT_PLACEHOLDER}
//             onChange={(event) => setUserInput(event.target.value)}
//             className="outline-none bg-transparent w-full h-32 max-h-56 resize-none"
//             value={userInput}
//           />
//           {userInput && (
//             <ArrowRight
//               onClick={() => onGenerate(userInput)}
//               className="bg-blue-500 h-8 w-8 p-2 rounded-md cursor-pointer"
//             />
//           )}
//         </div>
//         <div>
//           <Link className="h-5 w-5" />
//         </div>
//       </div>
//       <div className="flex flex-wrap max-w-2xl justify-center gap-3">
//         {Lookup?.SUGGSTIONS.map((suggestion, index) => (
//           <h2 className="border rounded-full p-1 px-2 text-sm text-gray-400 hover:text-white cursor-pointer" 
//           onClick={()=>onGenerate(suggestion)}
//           key={index}>{suggestion}</h2>
//         ))}
//       </div>
//       {/* Pass openDialog and setOpenDialog to the dialog component */}
//       <SigninDialog openDialog={openDialog} closeDialog={setOpenDialog} />
//     </div>
//   );
// }

// export default Hero;
