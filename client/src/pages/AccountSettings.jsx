import React, { useState, useEffect } from "react"
import axios from "axios"
import { useGetUserID } from "../hooks/useGetUserID"
import { useCookies } from "react-cookie"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { useGlobalContext } from "../context/globalContext"

const AccountSettings = () => {
  const { currentUser } = useGlobalContext()
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  })

  const [errors, setErrors] = useState({})

  const [cookies, _] = useCookies(["blog_token"])
  const userID = useGetUserID()
  const navigate = useNavigate()

  useEffect(() => {
    setUserData(currentUser || userData)
  }, [currentUser])

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!userData || !userData.username?.trim()) {
      newErrors.username = "Username is required"
    }

    if (!userData || !userData.email?.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = "Email is not valid"
    }

    if (!userData || !userData.currentPassword?.trim()) {
      newErrors.currentPassword = "Current Password is required"
    }

    if (userData?.newPassword?.trim() !== userData?.repeatNewPassword?.trim()) {
      newErrors.repeatNewPassword = "Passwords do not match"
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const response = await axios.patch(
        "http://localhost:5000/api/v1/auth/account",
        userData,
        {
          headers: { authorization: cookies.blog_token },
        }
      )

      if (response.status === 200) {
        toast(response.data.message)
        navigate(`/user/${userID}`)
      }
    } catch (error) {
      if (error.response.status === 401) {
        return setErrors({ ...errors, currentPassword: "Wrong password" })
      }
    }
  }

  return (
    <div className="container mx-auto mt-8 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-4">Account Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            className={`px-3 py-2 border rounded w-full ${
              errors.username ? "border-red-500" : ""
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
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
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className={`px-3 py-2 border rounded w-full ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="currentPassword"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Current Password:
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            onChange={handleChange}
            className={`px-3 py-2 border rounded w-full ${
              errors.currentPassword ? "border-red-500" : ""
            }`}
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            New Password:
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            onChange={handleChange}
            className="px-3 py-2 border rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="repeatNewPassword"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Repeat New Password:
          </label>
          <input
            type="password"
            id="repeatNewPassword"
            name="repeatNewPassword"
            onChange={handleChange}
            className={`px-3 py-2 border rounded w-full ${
              errors.repeatNewPassword ? "border-red-500" : ""
            }`}
          />
          {errors.repeatNewPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.repeatNewPassword}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}

export default AccountSettings
