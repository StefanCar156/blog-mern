import express from "express"
import { verifyToken } from "../middleware/auth.js"
import {
  getPost,
  getAllPosts,
  getUserPosts,
  getRecommendedPosts,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.js"

const router = express.Router()

router.route("/").get(getAllPosts).post(verifyToken, createPost)
router.route("/user/:userID").get(getUserPosts)
router
  .route("/:postID")
  .get(getPost)
  .patch(verifyToken, updatePost)
  .delete(verifyToken, deletePost)
router.route("/:postID/recommended").get(getRecommendedPosts)

export default router
