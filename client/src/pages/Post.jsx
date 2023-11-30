import { useEffect, useState } from "react"
import { useGetAuthorName } from "../hooks/useGetAuthorName"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { FaEdit, FaRegTrashAlt } from "react-icons/fa"
import { toast } from "react-toastify"
import { useCookies } from "react-cookie"

const Post = () => {
  const { postID } = useParams()
  const [post, setPost] = useState({})
  const authorName = useGetAuthorName(post.authorID)
  const [isPostAuthor, setIsPostAuthor] = useState(false)
  const navigate = useNavigate()
  const [cookies, _] = useCookies(["blog_token"])

  useEffect(() => {
    if (localStorage.getItem("userID") === post.authorID) setIsPostAuthor(true)
  }, [post])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/posts/${postID}`
        )
        setPost(res.data.post)
      } catch (error) {
        console.error("Error fetching post:", error)
      }
    }

    fetchPost()
  }, [postID])

  const handleEditPost = () => {
    navigate(`/post/edit/${postID}`)
  }

  const handleRemovePost = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/posts/${postID}`,
        {
          headers: { authorization: cookies.blog_token },
        }
      )

      if (res.status === 200) {
        toast.success("Post deleted successfully!")
        navigate("/")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  return (
    <div className="mt-8 p-8 bg-white flex flex-col items-center">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="mb-4 rounded w-1/2"
      />
      <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500">Author: {authorName}</p>
      <p className="text-gray-700 mb-4 self-start">{post.content}</p>
      {isPostAuthor && (
        <div className="flex space-x-2">
          <button
            onClick={handleEditPost}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          >
            <FaEdit className="inline-block mr-2" /> <span>Edit Post</span>
          </button>
          <button
            onClick={handleRemovePost}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline-red"
          >
            <FaRegTrashAlt className="inline-block mr-2" />{" "}
            <span>Remove Post</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Post
