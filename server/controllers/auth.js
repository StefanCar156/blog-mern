import User from "../models/Users.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const register = async (req, res) => {
  const { username, email, password } = req.body

  const user = await User.findOne({ $or: [{ username }, { email }] })

  // Check if credentials are already used
  if (user) {
    let message

    switch (user) {
      case user.username === username && user.email === email:
        message = "Username and email already exist!"
        break
      case user.username === username:
        message = "Username already exists!"
        break
      default:
        message = "Email already exists!"
    }

    return res.status(409).json({ message })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = new User({ username, email, password: hashedPassword })
  await newUser.save()

  res.json("User registered successfully!")
}

const login = async (req, res) => {
  const { identifier, password } = req.body
  const user = await User.findOne({
    $or: [{ username: identifier }, { email: identifier }],
  })

  if (!user) {
    return res.status(404).json({ message: "User does not exist!" })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Password is incorrect!" })
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  })
  res.json({ token, userID: user._id })
}

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userID)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

const getUserName = async (req, res) => {
  try {
    const user = await User.findById(req.params.userID)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const { username } = user

    res.status(200).json({ username })
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export { register, login, getUser, getUserName }
