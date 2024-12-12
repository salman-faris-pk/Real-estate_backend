import bcrypt from "bcryptjs"
import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"


const Register =async(req,res)=>{
  
    const {username,email,password}=req.body;

    try{
    const existUser=await prisma.user.findFirst({
        where:{
            OR:[
                {username},
                { email }
            ],
        },
     });
     if(existUser){
        const conflictMessage=[];
        if(existUser.username === username){
            conflictMessage.push("Username already exists");
        }
        if(existUser.email === email){
            conflictMessage.push("Email already exists ");
        }
        return res.status(400).json({
            message: conflictMessage.join(" and ") +".Try again."
        })
     };

    const hashedpass=await bcrypt.hash(password,10)

     await prisma.user.create({
        data:{
            username,
            email,
            password:hashedpass
        }
    });


    res.status(201).json({success:true,message:"User created  succcesfully"});

   }catch(err){
    console.log(err);
    res.status(500).json({ message: "Failed to create user!" });
   }

};




 const Login =async(req,res)=>{
   const {username,password}=req.body;

   try {

    const user=await prisma.user.findUnique({
        where:{ username }
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

   const isPasswordValid= await bcrypt.compare(password, user.password);

   if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Credentials!" });
   }

   const age = 60 * 60 * 24 * 7;

   const token= jwt.sign({id: user.id,isAdmin: false},process.env.SECRET_KEY,{expiresIn: age});

   const {password: userPassword,...userInfo}= user;

   res.cookie("token", token,{
     httpOnly: true,
    //  secure:true,
     maxAge: age,
   }).status(200).json({success:true,userInfo})
   
    
   } catch (err) {
     console.log(err);
     res.status(500).json({ message: "Failed to login!" });
   }
};


const Logout =async(req,res)=>{
    res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};


export {
    Register,
    Login,
    Logout
}