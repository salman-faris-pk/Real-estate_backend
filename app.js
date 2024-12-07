import express from "express"
const Port=8800;
import authRoute from "./routes/auth.routes.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import cors from "cors";
import cookieParser from "cookie-parser";


const app=express();


app.use(cors({
    origin:"*",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/post",postRoute)


app.listen(Port,()=>{
    console.log("server listen on ",Port);
})
