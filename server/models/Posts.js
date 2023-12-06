import mongoose from "mongoose"
import Comment from "./Comment.js"

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    authorID: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [Comment.schema],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const Post = mongoose.model("Post", PostSchema)

export default Post
