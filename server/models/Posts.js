import mongoose from "mongoose"

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
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

const Post = mongoose.model("Post", PostSchema)

export default Post
