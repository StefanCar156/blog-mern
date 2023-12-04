import Post from "../models/Posts.js"

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    res.json({ post })
  } catch (error) {
    console.error("Error fetching post:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
    res.json({ posts })
  } catch (error) {
    res.json(error)
  }
}

const getUserPosts = async (req, res) => {
  try {
    const userID = req.params.userID

    const posts = await Post.find({ authorID: userID })

    if (!posts) {
      return res.json({ message: "No posts found!" })
    }

    res.status(200).json({ posts })
  } catch (error) {
    console.error("Error fetching post:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

const getRecommendedPosts = async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.postID)

    if (!currentPost) {
      return res.status(404).json({ message: "Post not found" })
    }

    const recommendedPosts = await Post.find({
      _id: { $ne: currentPost._id },
    })
      .sort({ createdAt: -1 })
      .limit(3)

    res.json({ recommendedPosts })
  } catch (error) {
    console.error("Error fetching recommended posts:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

const createPost = async (req, res) => {
  const newPost = new Post(req.body)

  try {
    await newPost.save()
    res.status(201).json({ message: "Post created succcessfully!" })
  } catch (error) {
    res.json(error)
  }
}

const updatePost = async (req, res) => {
  const postID = req.params.postID

  const { title, content, imageUrl } = req.body

  if (!title || !content || !imageUrl) {
    throw new Error("Please fill in all fields")
  }

  await Post.findByIdAndUpdate({ _id: postID }, req.body)

  res.status(204).json({ message: "Post updated successfully!" })
}

const deletePost = async (req, res) => {
  const postID = req.params.postID

  await Post.deleteOne({ _id: postID })

  res.status(200).json({ message: `Post removed successfully!` })
}

export {
  getPost,
  getAllPosts,
  getUserPosts,
  getRecommendedPosts,
  createPost,
  updatePost,
  deletePost,
}
