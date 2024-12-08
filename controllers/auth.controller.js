import bcrypt from "bcryptjs"


const Register =async(req,res)=>{
  
    const {username,email,password}=req.body;
    //  const existUser

    const hashedpassd=await bcrypt.hash(password,10)

};


 const Login =(req,res)=>{

};


const Logout =(req,res)=>{

};


export {
    Register,
    Login,
    Logout
}