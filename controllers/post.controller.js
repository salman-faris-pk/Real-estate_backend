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
        
    } catch (error) {
       console.log(err);
       res.status(500).json({ message: "Failed to get posts" });
    }
};



const getPost= async(req,res)=>{
    
    const id= req.params.id;

    try {
        const post= await prisma.post.findUnique({
            where:{ id },
            include:{
                postDetail: true,
                user:{
                    select:{
                        username: true,
                        avatar: true,
                    }
                }
            }
        });

        const token= req.cookies?.token;

        if(token){
            jwt.verify(token, process.env.SECRET_KEY,async(err, payload)=> {
                if(!err){
                    const saved= await prisma.savedPost.findUnique({
                        where:{
                            userId_postId: {
                                postId: id,
                                userId: payload.id,
                            }
                        }
                    });

                    res.status(200).json({...post, isSaved: saved ? true : false});
                }
            });
        };


        res.status(200).json({
            ...post,
            isSaved: false
        });

        
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Failed to get post" });
    }
};



const addPost= async(req,res)=>{

};


const updatePost= async(req,res)=>{

};


const deletePost= async(req,res)=>{

};











export {
    getPosts,
    getPost,
    addPost,
    updatePost,
    deletePost
}