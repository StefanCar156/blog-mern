import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./db/connectDB.js"

const app = express()

// Routers
import authRouter from "./routes/auth.js"
import postsRouter from "./routes/posts.js"
import searchRouter from "./routes/search.js"

// Middleware
app.use(express.json())
app.use(cors())

// Routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/posts", postsRouter)
app.use("/api/v1/search", searchRouter)

// PORT
const PORT = 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  } catch (error) {
    console.error(error)
  }
}

start()
