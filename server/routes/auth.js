import express from "express"
import {
  register,
  login,
  getUser,
  getUserName,
  changeUserInfo,
} from "../controllers/auth.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/users/:userID").get(getUser)
router.route("/:userID").get(getUserName)
router.route("/account").patch(verifyToken, changeUserInfo)

export default router
