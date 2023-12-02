// search.js in controllers directory
import Post from "../models/Posts.js"
import User from "../models/Users.js"

const search = async (req, res) => {
  try {
    const query = req.params.query

    // Search for posts
    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    })

    // Search for users
    const users = await User.find({
      username: { $regex: query, $options: "i" },
    })

    return res.status(200).json({ posts, users })
  } catch (error) {
    console.error("Error searching posts and users:", error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export { search }
