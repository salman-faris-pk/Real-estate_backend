import express from "express";
import {getAllUsers,getUser,updateUser,deleteUser,savePost, profilePosts,getNotificationNumber} from "../controllers/user.controller.js"
import { verifyToken } from "../middelware/verifyToken.js"
const router = express.Router();


router.get('/',getAllUsers)
router.get('/search/:id',verifyToken,getUser)
router.put('/:id',verifyToken,updateUser)
router.delete("/:id",verifyToken, deleteUser)
router.post("/save",verifyToken, savePost)
router.get("/profilePosts", verifyToken, profilePosts)
router.get("/notifications",verifyToken,getNotificationNumber)


export default router;