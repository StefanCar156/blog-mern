import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import Card from "../components/Card"
import { useGetUserID } from "../hooks/useGetUserID.js"
import { IoSettingsSharp } from "react-icons/io5"
import Pagination from "../components/Pagination"

const User = () => {
  const [user, setUser] = useState({})
  const [posts, setPosts] = useState([])
  const { userID } = useParams()
  const [isUsersProfile, setIsUsersProfile] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 8

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/auth/users/${userID}`
        )

        setUser(res.data.user)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUser()
  }, [userID])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/posts/user/${userID}`
        )

        setPosts(res.data.posts)
      } catch (error) {
        console.error(error)
      }
    }

    fetchPosts()
  }, [userID])

  useEffect(() => {
    if (userID === useGetUserID()) setIsUsersProfile(true)
  }, [])

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="container px-8 mt-8 mb-8 flex flex-col">
      <div className="flex items-center mb-8 gap-4 w-full">
        <img
          src="https://static.thenounproject.com/png/1095867-200.png"
          alt="Profile"
          className="w-16 h-16 rounded-full mr-4"
        />
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-gray-600">{user.email}</p>
        </div>
        {isUsersProfile && (
          <Link
            to="/user/settings"
            className="self-start ml-auto flex items-center gap-2 text-sm text-gray-500"
          >
            <IoSettingsSharp className="text-gray-700" />
            <span className="font-bold">Account Settings</span>
          </Link>
        )}
      </div>
      <section className="mb-8">
        <h3 className="text-2xl font-bold mb-4">{user.username}'s posts</h3>
        {currentPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentPosts.map((post) => (
              <Card key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-lg mt-6">No posts yet</p>
        )}

        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={posts.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </section>
    </div>
  )
}

export default User
