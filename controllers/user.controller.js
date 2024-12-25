import prisma from '../lib/prisma.js'
import bcrypt from "bcryptjs"




const getAllUsers =async(req,res)=>{
  try {

    const users=await prisma.user.findMany();
    res.status(200).json(users);

  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};


const getUser= async(req,res)=>{
   const id = req.params.id;

   try {
    const user= await prisma.user.findUnique({
        where: { id },
    });

    res.status(200).json(user)
    
   } catch (error) {
     console.log(err);
     res.status(500).json({ message: "Failed to get user!" });
   }
};


const updateUser= async(req,res)=>{

    const id = req.params.id;
    const tokenuserId= req.userId;

    const { password, avatar,...inputs }= req.body;

    if(id !== tokenuserId){
        return res.status(403).json({ message: "Not Authorized!" });
    }
    
    let updatedPassword= null;

    try {

        if(password){
            updatedPassword= await bcrypt.hash(password, 10)
        }
 
        const UpdatedUser = await prisma.user.update({
            where: { id },
            data: {
                ...inputs,
                ...(updatedPassword && {password: updatedPassword}),
                ...(avatar && { avatar}),
            },
        });

        const {password:userPassword,...rest}=UpdatedUser;

        res.status(200).json(rest);
        
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Failed to update users!" });
    }


};


const deleteUser= async(req,res)=>{

    const id = req.params.id;
    const tokenUserId = req.userId;

    if(id !== tokenUserId){
        return res.status(403).json({ message: "Not Authorized!" });
      };

      try {
        await prisma.user.delete({
            where: { id },
        });

        res.status(200).json({ message: "User deleted" });
        
      } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Failed to delete users!" });
      }

};


const savePost=async(req,res)=>{

  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {

    const savedPost = await prisma.savedPost.findUnique({
        where:{
          userId_postId:{         //userId_postId refers to a composite unique key that includes both the userId and postId fields
            userId: tokenUserId,
            postId,
          }
        }
    });

    if(savedPost){
        await prisma.savedPost.delete({
           where:{
            id: savedPost.id,
           }
        });

        res.status(200).json({ message: "Post removed from saved list" });
    }else{
      await prisma.savedPost.create({
        data:{
           userId: tokenUserId,
           postId
        }
      });
      res.status(200).json({ message: "Post saved" });
    }
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save or unsave posts!" });
  }
};



const  profilePosts=async(req,res)=>{

  const tokenUserId = req.userId;

  try {

    const userPosts= await prisma.post.findMany({
      where:{ userId: tokenUserId },
    });

    const savepost= await prisma.savedPost.findMany({
       where: { userId: tokenUserId},
       include: {
        post: true
       },
    });


    const savedPosts= savepost.map((item)=>  item.post);

     res.status(200).json({ userPosts, savedPosts });
    
  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch profile posts!" });
  }
};





export {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    savePost,
    profilePosts,
}