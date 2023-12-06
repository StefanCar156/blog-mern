import React, { useState, useEffect } from "react"
import axios from "axios"
import Card from "../components/Card"
import Pagination from "../components/Pagination"

const Home = () => {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get(`http://localhost:5000/api/v1/posts`, {
        params: {
          page: currentPage,
          perPage: 8,
        },
      })

      setPosts(res.data.posts)
      setTotalPages(res.data.totalPages)
    }

    fetchPosts()
  }, [currentPage])

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {posts.map((post) => (
          <Card key={post._id} post={post} />
        ))}
      </div>

      <Pagination
        postsPerPage={8}
        totalPosts={totalPages * 8}
        paginate={handlePageChange}
        currentPage={currentPage}
      />
    </div>
  )
}

export default Home
