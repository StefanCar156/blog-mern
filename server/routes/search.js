// search.js
import express from "express"
import { search } from "../controllers/search.js"

const router = express.Router()

router.route("/:query").get(search)

export default router
