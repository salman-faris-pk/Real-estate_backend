import express from "express"
const Port=8800;
import authRoute from "./routes/auth.routes.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import testRoute from "./routes/test.route.js"
import cahtRoute from "./routes/chat.route.js"
import messRoute from "./routes/message.route.js"
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
dotenv.config();

const app=express();


app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/post",postRoute)
app.use("/api/test",testRoute);
app.use("/api/chat",cahtRoute);
app.use("/api/msg",messRoute);


app.listen(Port,()=>{
    console.log("server listen on ",Port);
})
