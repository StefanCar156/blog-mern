import express from "express"
import { verifyToken } from "../middleware/auth.js"
import {
  getPost,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.js"

const router = express.Router()

router.route("/").get(getAllPosts).post(verifyToken, createPost)
router
  .route("/:postID")
  .get(getPost)
  .patch(verifyToken, updatePost)
  .delete(verifyToken, deletePost)

export default router
