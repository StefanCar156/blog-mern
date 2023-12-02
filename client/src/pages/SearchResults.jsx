import React, { useEffect, useState } from "react"
import axios from "axios"
import { Link, useSearchParams } from "react-router-dom"

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState({ posts: [], users: [] })
  const [searchParams] = useSearchParams()
  const query = searchParams.get("query")

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/search/${query}`
        )

        const { posts, users } = res.data
        setSearchResults({ posts, users })
      } catch (error) {
        console.error("Error fetching search results:", error)
      }
    }

    fetchSearchResults()
  }, [query])

  return (
    <div className="container px-6 mt-8">
      <h2 className="text-3xl font-bold mb-4">Search Results</h2>

      {Object.entries(searchResults).map(([category, results]) =>
        results.length > 0 ? (
          <div key={category} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">
              {category === "posts" ? "Posts" : "Users"}
            </h3>
            {results.map((result) => (
              <Link
                to={
                  result.username
                    ? `/user/${result._id}`
                    : `/post/${result._id}`
                }
                key={result._id}
                className="block mb-2 p-4 border border-gray-300 rounded hover:bg-gray-100"
              >
                {result.username ? (
                  <div className="flex items-center">
                    <img
                      src="https://static.thenounproject.com/png/1095867-200.png"
                      alt="Profile"
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <h3>{result.username}</h3>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <img
                      src={result.imageUrl}
                      alt="Post"
                      className="w-16 h-16 mr-4"
                    />
                    <div>
                      <h3 className="text-xl font-medium">{result.title}</h3>
                      <p className="text-sm">
                        {result.content.length < 35
                          ? result.content
                          : `${result.content.substr(0, 32)}...`}
                      </p>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : null
      )}
    </div>
  )
}

export default SearchResults
