import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie"
import axios from "axios"
import { toast } from "react-toastify"

const Login = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!identifier) {
      newErrors.identifier = "Username or email is required"
    }
    if (!password) {
      newErrors.password = "Password is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const res = await axios.post("http://localhost:5000/api/v1/auth/login", {
        identifier,
        password,
      })

      onLogin({ user: res.data.userID, token: res.data.token })

      toast.success("Login successful!")
      navigate("/")
    } catch (error) {
      const newErrors = {}

      console.error("Error during loging in:", error)
      if (error.response.status == 404) {
        newErrors.identifier = "Username or email not registered!"
      }
      if (error.response.status == 401) {
        newErrors.password = "Wrong password!"
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 shadow-md rounded"
    >
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      <div className="mb-4">
        <label
          htmlFor="identifier"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username or Email:
        </label>
        <input
          type="text"
          name="identifier"
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className={`w-full border border-gray-300 p-2 rounded ${
            errors.identifier ? "border-red-500" : ""
          }`}
        />
        {errors.identifier && (
          <span className="text-red-500 text-sm">{errors.identifier}</span>
        )}
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Password:
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full border border-gray-300 p-2 rounded ${
            errors.password ? "border-red-500" : ""
          }`}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password}</span>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
      <p className="text-gray-700 text-sm mt-4">
        Don't have an account?{" "}
        <Link to="/auth/register" className="text-blue-500 hover:underline">
          Register here
        </Link>
      </p>
    </form>
  )
}

export default Login
