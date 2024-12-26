import express from "express"
import { verifyToken } from "../middelware/verifyToken.js"
import { getChat,getChats,addChat,readChat} from "../controllers/chat.controler.js"
const router=express.Router()




router.get("/", verifyToken, getChats);
router.get("/:id", verifyToken, getChat);
router.post("/", verifyToken, addChat);
router.put("/read/:id", verifyToken, readChat);



export default router