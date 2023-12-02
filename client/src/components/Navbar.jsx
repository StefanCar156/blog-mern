import React from "react"
import { Link } from "react-router-dom"
import { useCookies } from "react-cookie"
import { useNavigate } from "react-router-dom"
import { useGetUserID } from "../hooks/useGetUserID"
import SearchBar from "./SearchBar"

const Navbar = ({ onLogout }) => {
  const [cookies, _] = useCookies(["blog_token"])
  const navigate = useNavigate()
  const userID = useGetUserID()

  const logout = () => {
    onLogout()
    navigate("/auth/login")
  }

  return (
    <nav className="bg-gray-800 p-4 text-white flex items-center gap-10">
      <Link to="/" className="text-l font-semibold">
        Home
      </Link>
      {cookies.blog_token && <SearchBar />}
      {!cookies.blog_token ? (
        <>
          <Link to="/auth/login" className="ml-auto">
            Login
          </Link>
          <Link to="/auth/register" className="ml-4">
            Register
          </Link>
        </>
      ) : (
        <div className="flex items-center ml-auto space-x-4">
          <Link to={`/user/${userID}`} className="text-blue-400">
            Profile
          </Link>
          <Link to="/post/create" className="text-blue-400">
            Create new post
          </Link>
          <button onClick={logout} className="text-blue-400">
            Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
