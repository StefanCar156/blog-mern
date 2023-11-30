import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  const jwtSecret = process.env.JWT_SECRET

  if (authHeader) {
    jwt.verify(authHeader, jwtSecret, (err) => {
      if (err) {
        return res.sendStatus(403)
      }
      next()
    })
  } else {
    res.sendStatus(401)
  }
}
