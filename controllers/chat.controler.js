import prisma from "../lib/prisma.js"


const getChats =async(req,res)=>{

    const tokenUserId=req.userId;
    
    try {

      const chats=await prisma.chat.findMany({
        where:{
            userIDs:{
                hasSome: [tokenUserId]          //Checks if the userIDs array contains any of the values in the provided array [tokenUserId].
            },
        },
      });

       for (const chat of chats){
          const receiverId = chat.userIDs.find((id)=> id !== tokenUserId);

          const receiver = await prisma.user.findUnique({
            where:{
                id: receiverId,
            },
            select:{
                id: true,
                username: true,
                avatar: true,
            },
          });

          chat.receiver = receiver;
       };

       res.status(200).json(chats);
        
    } catch (err) {
       console.log(err);
       res.status(500).json({ message: "Failed to get chats!" });
    }

};



const getChat=async(req,res)=>{

    const tokenUserId = req.userId;

    try {

        const chat = await prisma.chat.findUnique({
            where:{
                id: req.params.id,
                userIDs: {
                    hasSome: [tokenUserId]
                },
            },
            include: {
                messages:{
                    orderBy: {
                        createdAt: "asc"
                    },
                },
            },
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found!" });
          };


          // Update the `seenBy` array only if `tokenUserId` is not already included
          if (!chat.seenBy.includes(tokenUserId)) {
           await prisma.chat.update({
            where: { id: req.params.id },
            data:{
                seenBy: {
                    set: [...chat.seenBy, tokenUserId]
                },
            },
         });
        }

         res.status(200).json(chat)
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get chat!" });
    }
};



const addChat=async(req,res)=>{

    const tokenUserId = req.userId;

    try {
        const newChat= await prisma.chat.create({
            data: {
                userIDs: [tokenUserId, req.body.receiverId],
            },
        });

        res.status(200).json(newChat);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to add chat!" });
    }
};



const readChat=async(req,res)=>{
   
    const tokenUserId = req.userId;

    try {
        const chat= await prisma.chat.update({
            where: {
                id: req.params.id,
                userIDs: {
                    hasSome : [tokenUserId],
                },
            },
            data:{
                seenBy: {
                    set: chat.seenBy.includes(tokenUserId) ? chat.seenBy : [...chat.seenBy, tokenUserId], // Only add if not already in the array
                },
            },
        });

        res.status(200).json(chat);
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to read chat!" });
    }
};



export {
    getChats,
    getChat,
    addChat,
    readChat
}