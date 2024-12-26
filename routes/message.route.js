import express from "express"
import { verifyToken } from "../middelware/verifyToken.js"
import { addMessaage } from "../controllers/mess.controller.js"
const router=express.Router()



router.post("/:chatId",verifyToken,addMessaage)

export default router;



