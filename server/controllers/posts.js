import Post from "../models/Posts.js"
import Comment from "../models/Comment.js"

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
    const page = parseInt(req.query.page) || 1
    const perPage = parseInt(req.query.perPage) || 8

    const totalPosts = await Post.countDocuments()
    const totalPages = Math.ceil(totalPosts / perPage)

    const posts = await Post.find({})
      .skip((page - 1) * perPage)
      .limit(perPage)

    res.json({ posts, totalPages })
  } catch (error) {
    console.error("Error fetching post:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

const getUserPosts = async (req, res) => {
  try {
    const userID = req.params.userID
    const page = parseInt(req.query.page) || 1
    const perPage = parseInt(req.query.perPage) || 8

    const totalPosts = await Post.countDocuments({ authorID: userID })
    const totalPages = Math.ceil(totalPosts / perPage)

    const posts = await Post.find({ authorID: userID })
      .skip((page - 1) * perPage)
      .limit(perPage)

    res.status(200).json({ posts, totalPages })
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

// Comments

const getComments = async (req, res) => {
  try {
    const postID = req.params.postID
    const post = await Post.findById(postID).select("comments")

    if (!post) {
      return res.status(404).json({ error: "Post not found" })
    }

    const comments = post.comments
    return res.status(200).json({ comments })
  } catch (error) {
    console.error("Error fetching comments:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

const addComment = async (req, res) => {
  const { postID } = req.params
  const { content } = req.body

  try {
    const post = await Post.findById(postID)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    const comment = new Comment({
      author: req.body.userID,
      authorName: req.body.username,
      content,
    })

    post.comments.push(comment)

    await post.save()

    res.status(201).json({ message: "Comment added successfully", comment })
  } catch (error) {
    console.error("Error adding comment:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export {
  getPost,
  getAllPosts,
  getUserPosts,
  getRecommendedPosts,
  createPost,
  updatePost,
  deletePost,
  getComments,
  addComment,
}
