import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useGetAuthorName } from "../hooks/useGetAuthorName.js"

const Card = ({ post }) => {
  const authorName = useGetAuthorName(post.authorID)

  return (
    <article className="max-w-sm rounded overflow-hidden shadow-lg mx-4 my-4">
      <img
        className="w-full h-32 object-cover"
        src={post.imageUrl}
        alt={post.title}
      />
      <div className="px-6 py-4">
        <h1 className="font-bold text-xl mb-2">{post.title}</h1>
        <h2 className="text-gray-600 text-sm mb-2">{authorName}</h2>
        <p className="text-gray-700 text-base">{post.content}</p>
      </div>
      <div className="px-6 py-4">
        <Link to={`/post/${post._id}`}>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Read More
          </button>
        </Link>
      </div>
    </article>
  )
}

export default Card
