import express from "express"
import { register, login, getUser, getUserName } from "../controllers/auth.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/users/:userID").get(getUser)
router.route("/:userID").get(getUserName)

export default router
