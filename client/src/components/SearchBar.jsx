import React, { useState, useEffect } from "react"
import axios from "axios"
import { Link, useSearchParams } from "react-router-dom"
import { debounce } from "lodash"
import { useGlobalContext } from "../context/globalContext"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searchParams] = useSearchParams()
  const currentQuery = searchParams.get("query")
  const { showSearchDropdown, setShowSearchDropdown } = useGlobalContext()

  useEffect(() => {
    setQuery(currentQuery || "")
  }, [currentQuery])

  const handleSearch = debounce(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/v1/search/${query}`
      )

      const { posts, users } = res.data
      setSearchResults({ posts, users })
    } catch (error) {
      console.error("Error searching:", error)
    }
  }, 300)

  useEffect(() => {
    if (query) {
      handleSearch()
    } else {
      setSearchResults([])
    }
  }, [query])

  const clearResults = () => {
    setSearchResults([])
  }

  const handleLinkClick = () => {
    clearResults()
    setShowSearchDropdown(false)
  }

  useEffect(() => {
    query ? setShowSearchDropdown(true) : setShowSearchDropdown(false)
  }, [query])

  return (
    <div className="relative ml-4 flex-1">
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-3 py-2 rounded focus:outline-none text-black w-full"
        onBlur={() => setTimeout(clearResults, 200)}
      />

      {showSearchDropdown && (
        <ul className="absolute z-10 mt-1 bg-gray-100 border border-gray-300 rounded-b w-full max-h-60 overflow-y-auto">
          {Object.entries(searchResults).map(([category, results]) => (
            <React.Fragment key={category}>
              <li className="px-4 py-2 text-gray-700 text-sm font-semibold">
                {category === "posts" ? "Posts" : "Users"}
              </li>
              {results.length > 0 ? (
                results.slice(0, 5).map((result) => (
                  <Link
                    to={
                      result.username
                        ? `/user/${result._id}`
                        : `/post/${result._id}`
                    }
                    key={result._id}
                    className="block px-4 py-2 hover:bg-gray-200 text-blue-400"
                    onClick={handleLinkClick}
                  >
                    {result.username ? (
                      <li className="flex items-center">
                        <img
                          src="https://static.thenounproject.com/png/1095867-200.png"
                          alt="Profile"
                          className="w-10 h-10 rounded-full mr-4"
                        />
                        <h3>{result.username}</h3>
                      </li>
                    ) : (
                      <li className="flex items-center">
                        <img
                          src={result.imageUrl}
                          alt="Post"
                          className="w-10 h-10 mr-4"
                        />
                        <div>
                          <h3 className="text-xl font-medium">
                            {result.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {result.content.length < 35
                              ? result.content
                              : `${result.content.substr(0, 32)}...`}
                          </p>
                        </div>
                      </li>
                    )}
                  </Link>
                ))
              ) : (
                <p className="block px-4 py-2 hover:bg-gray-200 text-blue-400">
                  No {category} found
                </p>
              )}
            </React.Fragment>
          ))}
          <Link
            to={`/search?query=${query}`}
            className="block px-4 py-3 font-bold text-gray-500 hover:bg-gray-200 text-center"
            onClick={() => {
              handleLinkClick()
              handleSearch()
            }}
          >
            Show all results
          </Link>
        </ul>
      )}
    </div>
  )
}

export default SearchBar
