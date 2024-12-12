import express from "express";
import { verifyToken } from "../middelware/verifyToken.js"
import {shouldBeAdmin,shouldBeLoggedIn} from "../controllers/test.controller.js"
const router = express.Router();



router.get("/should-be-loggedin",verifyToken,shouldBeLoggedIn)
router.get("/should-be-admin",shouldBeAdmin);




export default router;