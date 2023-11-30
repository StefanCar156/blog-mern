import "./index.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Navbar from "./components/Navbar"
import Post from "./pages/Post"
import CreatePost from "./pages/CreatePost"
import { CookiesProvider, useCookies } from "react-cookie"

function App() {
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
    <CookiesProvider>
      <div className="app">
        <Router>
          <ToastContainer />
          <Navbar onLogout={handleLogout} />
          <main className="mt-8">
            <Routes>
              <Route
                path="/"
                element={
                  cookies.blog_token ? <Home /> : <Navigate to="/auth/login" />
                }
              />
              <Route
                path="/auth/register"
                element={
                  !cookies.blog_token ? <Register /> : <Navigate to="/" />
                }
              />
              <Route
                path="/auth/login"
                element={
                  !cookies.blog_token ? (
                    <Login onLogin={handleLogin} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route path="/post/:postID" element={<Post />} />
              <Route
                path="/post/create"
                element={
                  cookies.blog_token ? (
                    <CreatePost />
                  ) : (
                    <Navigate to="/auth/login" />
                  )
                }
              />
              <Route
                path="/post/edit/:postID"
                element={
                  cookies.blog_token ? (
                    <CreatePost />
                  ) : (
                    <Navigate to="/auth/login" />
                  )
                }
              />
            </Routes>
          </main>
        </Router>
      </div>
    </CookiesProvider>
  )
}

export default App
