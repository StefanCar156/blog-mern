import React from "react"

const Pagination = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className="mt-8 flex justify-center w-full">
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`inline-block mx-1 ${
              number === currentPage
                ? "bg-blue-500 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            <button
              onClick={() => paginate(number)}
              className="px-3 py-2 rounded focus:outline-none"
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Pagination
