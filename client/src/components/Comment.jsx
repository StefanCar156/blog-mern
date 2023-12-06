import React from "react"
import moment from "moment"

const Comment = ({ comment }) => {
  const timeAgo = moment(comment.createdAt).fromNow()

  return (
    <li className="my-8">
      <div className="flex items-baseline gap-2">
        <p className="text-gray-500">{comment.authorName}</p>
        <p className="text-gray-500 text-xs">{timeAgo}</p>
      </div>
      <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
    </li>
  )
}

export default Comment
