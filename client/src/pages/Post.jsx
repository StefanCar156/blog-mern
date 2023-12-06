import { useEffect, useState } from "react"
import { useGetAuthorName } from "../hooks/useGetAuthorName"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { FaEdit, FaRegTrashAlt } from "react-icons/fa"
import { toast } from "react-toastify"
import { useCookies } from "react-cookie"
import readingTime from "reading-time/lib/reading-time"
import Card from "../components/Card"
import Comments from "../components/Comments"
import { useGetUserID } from "../hooks/useGetUserID"
import { useGlobalContext } from "../context/globalContext"

const Post = () => {
  const { postID } = useParams()
  const [post, setPost] = useState({})
  const authorName = useGetAuthorName(post.authorID)
  const userID = useGetUserID()
  const [isPostAuthor, setIsPostAuthor] = useState(false)
  const navigate = useNavigate()
  const [cookies, _] = useCookies(["blog_token"])
  const [readTime, setReadTime] = useState("")
  const [recommendedPosts, setRecommendedPosts] = useState([])
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")
  const { currentUser } = useGlobalContext()

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

  useEffect(() => {
    if (post.content) setReadTime(readingTime(post.content).text)
  }, [post.content])

  useEffect(() => {
    const fetchRecommendedPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/posts/${postID}/recommended`
        )
        setRecommendedPosts(res.data.recommendedPosts)
      } catch (error) {
        console.error("Error fetching recommended posts:", error)
      }
    }

    fetchRecommendedPosts()
  }, [postID])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/posts/${postID}/comments`
        )
        setComments(response.data.comments)
      } catch (error) {
        console.error("Error fetching comments:", error)
      }
    }

    fetchComments()
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

  const handleAddComment = async (postId, content) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/posts/${postId}/comments`,
        {
          content,
          userID,
          username: currentUser.username,
        },
        { headers: { authorization: cookies.blog_token } }
      )

      const newComment = response.data.comment

      setComments((prevComments) => [...prevComments, newComment])
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Error adding comment. Please try again.")
    }
  }

  return (
    post && (
      <div className="mt-8 p-8 bg-white flex flex-col">
        <section className="pb-8">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="mb-4 rounded w-1/2"
          />
          <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
          <p className="text-sm text-gray-500">
            Author:{" "}
            <span className="font-bold">
              <Link to={`/user/${post.authorID}`}>{authorName}</Link>
            </span>
          </p>
          <p className="text-sm text-gray-500">Read time: {readTime}</p>
          <p className="text-gray-700 my-6 self-start text-justify">
            {post.content}
          </p>
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
        </section>
        <Comments
          comments={comments}
          postId={postID}
          onAddComment={handleAddComment}
        />
        <section className="border-t border-gray-300 pt-6">
          {recommendedPosts.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Read This</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {recommendedPosts.map((recommendedPost) => (
                  <Card key={recommendedPost._id} post={recommendedPost} />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    )
  )
}

export default Post
