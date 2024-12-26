import prisma from "../lib/prisma.js";


export const addMessaage =async(req,res)=>{

    const tokenUserId = req.userId;
    const chatId = req.params.chatId;
    const { text } = req.body; 


    try {
    
        const chat =await prisma.chat.findUnique({
            where:{
                id: chatId,
                userIDs: {
                    hasSome: [tokenUserId]
                },
            },
        });

        if (!chat || !chat.userIDs.includes(tokenUserId)) {
            return res.status(404).json({ message: "Chat not found!" });
        };

        const message= await prisma.message.create({
            data:{
                text,
                chatId,
                userId: tokenUserId,
            },
        });

        // Update the chat with the latest message and reset the `seenBy` field
        await prisma.chat.update({
            where: {
                id: chatId
            },
            data:{
                seenBy: [...new Set([...chat.seenBy, tokenUserId])], //Removes duplicates, so each user ID appears only once and Returns a new array with unique IDs.
                lastMessage: text,
            },
        });
     

        res.status(200).json(message);

        
    } catch (err) {
      console.log(err);
     res.status(500).json({ message: "Failed to add message!" });  
    }
};