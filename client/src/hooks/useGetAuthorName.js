import { useState, useEffect } from "react"
import axios from "axios"

export const useGetAuthorName = (authorID) => {
  const [authorName, setAuthorName] = useState("")

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/auth/${authorID}`
        )
        setAuthorName(res.data.username)
      } catch (error) {
        console.error("Error fetching author:", error)
      }
    }

    if (authorID) {
      fetchAuthor()
    }
  }, [authorID])

  return authorName
}
