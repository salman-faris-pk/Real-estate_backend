import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"



const getPosts= async(req,res)=>{

    const query= req.query;

    try {
        const posts = await prisma.post.findMany({
            where: {
              city: query.city || undefined,
              type: query.type || undefined,
              property: query.property || undefined,
              bedroom: parseInt(query.bedroom) || undefined,
              price: {
                gte: parseInt(query.minPrice) || undefined,
                lte: parseInt(query.maxPrice) || undefined,
              },
            },

        });

          res.status(200).json(posts)
        
    } catch (err) {
       console.log(err);
       res.status(500).json({ message: "Failed to get posts" });
    }
};




const getPost = async (req, res) => {

    const id = req.params.id;
  
    try {

      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          postDetail: true,
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      const token = req.cookies?.token;
  
      let isSaved = false;
  
      if (token) {
        try {
          const payload = jwt.verify(token, process.env.SECRET_KEY);
          
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
  
          isSaved = !!saved; 

        } catch (err) {
          console.log("Token verification failed:", err.message);
        }
      };

      res.status(200).json({ ...post, isSaved });
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to get post" });
    }
  };
  



const addPost= async(req,res)=>{
   
    const body= req.body;
    const tokenUserId= req.userId;

  
    try {
        const newPost= await prisma.post.create({
            data:{
                ...body.postData,
                userId: tokenUserId,
                postDetail: {
                    create: body.postDetail,    //Used to create related nested  related PostDetail
                },
            },
        });

        res.status(200).json(newPost)
        
    } catch (err) {
        console.log(err);
       res.status(500).json({ message: "Failed to create post" });
    }
}; 
 

const updatePost= async(req,res)=>{
    try {
        res.status(200).json();
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to update posts" });
      }
};


const deletePost= async(req,res)=>{
    const id = req.params.id;
    const tokenUserId = req.userId;
  
    try {

      const post = await prisma.post.findUnique({
        where: { id },
        include: { postDetail: true}
      });

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
    }
  
      if (post.userId !== tokenUserId) {
        return res.status(403).json({ message: "Not Authorized!" });
      }
  
      //delete PostDetail first, then Post

       await prisma.$transaction([
         prisma.postDetail.deleteMany({ where: { postId : id}}),
         prisma.post.delete({ where : { id }}),
       ])
  
      res.status(200).json({ message: "Post deleted" })

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to delete post" });
    }
};











export {
    getPosts,
    getPost,
    addPost,
    updatePost,
    deletePost
}