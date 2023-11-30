import React, { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

const Register = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})

  const navigate = useNavigate()

  const validateEmailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!username) {
      newErrors.username = "Username is required!"
    }
    if (!email) {
      newErrors.email = "Email is required!"
    } else if (!validateEmailFormat(email)) {
      newErrors.email = "Invalid email format!"
    }
    if (!password) {
      newErrors.password = "Password is required!"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          username,
          email,
          password,
        }
      )

      toast.success("You have registered successfully! Now login")
      navigate("/auth/login")
    } catch (error) {
      console.error("Error during registration:", error)
      toast.error(error.response.data.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-8 shadow-md rounded"
    >
      <h2 className="text-2xl font-semibold mb-6">Register</h2>
      <div className="mb-4">
        <label
          htmlFor="username"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Username:
        </label>
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`w-full border border-gray-300 p-2 rounded ${
            errors.username ? "border-red-500" : ""
          }`}
        />
        {errors.username && (
          <span className="text-red-500 text-sm">{errors.username}</span>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Email:
        </label>
        <input
          type="text"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full border border-gray-300 p-2 rounded ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
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
        Register
      </button>
    </form>
  )
}

export default Register
