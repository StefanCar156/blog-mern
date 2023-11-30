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

export { getPost, getAllPosts, createPost, updatePost, deletePost }
