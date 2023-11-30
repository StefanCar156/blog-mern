import React, { useState, useEffect } from "react"
import { useCookies } from "react-cookie"
import { useGetUserID } from "../hooks/useGetUserID.js"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate, useParams } from "react-router-dom"

const CreatePost = () => {
  const userID = useGetUserID()
  const [cookies, _] = useCookies("blog_token")
  const navigate = useNavigate()
  const [post, setPost] = useState({
    title: "",
    content: "",
    imageUrl: "",
    authorID: userID,
  })
  const [errors, setErrors] = useState({
    title: "",
    content: "",
    imageUrl: "",
  })
  const { postID } = useParams()

  useEffect(() => {
    if (postID) {
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
    }
  }, [postID])

  const handleChange = (e) => {
    const { name, value } = e.target
    setPost({ ...post, [name]: value })

    setErrors({ ...errors, [name]: "" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form fields
    const newErrors = {}
    Object.keys(post).forEach((key) => {
      if (!post[key]) {
        let friendlyFieldName
        switch (key) {
          case "title":
            friendlyFieldName = "Title"
            break
          case "content":
            friendlyFieldName = "Content"
            break
          case "imageUrl":
            friendlyFieldName = "Image URL"
            break
          default:
            friendlyFieldName = key
        }
        newErrors[key] = `${friendlyFieldName} is required`
      }
    })

    // If there are errors, update the state and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    }

    if (postID) {
      // Update Post

      try {
        const res = await axios.patch(
          `http://localhost:5000/api/v1/posts/${postID}`,
          post,
          {
            headers: { authorization: cookies.blog_token },
          }
        )

        if (res.status === 204) {
          navigate("/")
          toast.success("Post updated!")
        }
      } catch (error) {
        console.error("Error during creating post:", error)
        toast.error(error.response.data.message)
      }
    } else {
      // Create New Post
      try {
        const res = await axios.post(
          "http://localhost:5000/api/v1/posts",
          post,
          {
            headers: { authorization: cookies.blog_token },
          }
        )

        if (res.status === 201) {
          navigate("/")
          toast.success("Post created!")
        }
      } catch (error) {
        console.error("Error during creating post:", error)
        toast.error(error.response.data.message)
      }
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-md rounded create-post">
      <h2 className="text-2xl font-semibold mb-6">
        {postID ? "Edit" : "Create"} Blog Post
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            className={`w-full border border-gray-300 p-2 rounded ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title}</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Content:
          </label>
          <textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleChange}
            className={`w-full border border-gray-300 p-2 rounded h-40 ${
              errors.content ? "border-red-500" : ""
            }`}
          ></textarea>
          {errors.content && (
            <span className="text-red-500 text-sm">{errors.content}</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="imageUrl"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Image URL:
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={post.imageUrl}
            onChange={handleChange}
            className={`w-full border border-gray-300 p-2 rounded ${
              errors.imageUrl ? "border-red-500" : ""
            }`}
          />
          {errors.imageUrl && (
            <span className="text-red-500 text-sm">{errors.imageUrl}</span>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default CreatePost
