import { createContext, useContext, useState, useEffect } from "react"
import { useCookies } from "react-cookie"
import axios from "axios"

const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [cookies, setCookie] = useCookies(["blog_token"])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  const handleLogin = ({ user, token }) => {
    setCookie("blog_token", token, { path: "/" })
    localStorage.setItem("userID", user)
  }

  const handleLogout = () => {
    setCookie("blog_token", "")
    localStorage.removeItem("userID")
  }

  // Fetch user data based on userID from localStorage
  useEffect(() => {
    const fetchUserData = async () => {
      const userID = localStorage.getItem("userID")

      if (userID) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/v1/auth/users/${userID}`
          )

          setCurrentUser(response.data.user)
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
    }

    fetchUserData()
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        handleLogin,
        handleLogout,
        showSearchDropdown,
        setShowSearchDropdown,
        currentUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(GlobalContext)
}

export { GlobalContext, GlobalProvider }
