import { createContext, useContext, useState } from "react"
import { useCookies } from "react-cookie"

const GlobalContext = createContext()

const GlobalProvider = ({ children }) => {
  const [cookies, setCookie] = useCookies(["blog_token"])

  const handleLogin = ({ user, token }) => {
    setCookie("blog_token", token, { path: "/" })
    localStorage.setItem("userID", user)
  }

  const handleLogout = () => {
    setCookie("blog_token", "")
    localStorage.removeItem("userID")
  }

  return (
    <GlobalContext.Provider value={{ handleLogin, handleLogout }}>
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(GlobalContext)
}

export { GlobalContext, GlobalProvider }
