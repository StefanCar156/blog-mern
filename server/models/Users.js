import mongoose from "mongoose"
import validator from "validator"

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "{VALUE} is not a valid email!"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const User = mongoose.model("User", UserSchema)

export default User
