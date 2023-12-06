import React, { useState } from "react"
import Comment from "./Comment"

const Comments = ({ comments, postId, onAddComment }) => {
  const [newComment, setNewComment] = useState("")

  const handleCommentSubmit = () => {
    onAddComment(postId, newComment)
    setNewComment("")
  }

  return (
    <section className="border-t border-gray-300 pt-6">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      <div className="mt-4 flex flex-col overflow-hidden gap-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full px-4 py-2 resize-none focus:outline-none border border-gray-200 rounded-md"
          placeholder="Add a public comment..."
        />
        <div className="flex items-center gap-4">
          <button
            onClick={handleCommentSubmit}
            className={`bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 focus:outline-none ${
              !newComment ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!newComment}
          >
            Comment
          </button>

          <button
            onClick={() => setNewComment("")}
            className="text-gray-500 px-3 py-2 rounded border border-gray-400 hover:bg-gray-200 focus:outline-none"
          >
            Cancel
          </button>
        </div>
      </div>

      <ul className="mt-4">
        {comments
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((comment, i) => (
            <Comment key={i} comment={comment} />
          ))}
      </ul>
    </section>
  )
}

export default Comments
