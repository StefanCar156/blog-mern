import React, { useState, useEffect } from "react"
import axios from "axios"
import Card from "../components/Card"

const Home = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("http://localhost:5000/api/v1/posts")
      setPosts(res.data.posts)
    }

    fetchPosts()
  }, [])

  return (
    <div className="flex">
      {posts.map((post) => (
        <Card key={post._id} post={post} />
      ))}
    </div>
  )
}

export default Home
