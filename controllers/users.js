const bcrypt = require("bcrypt")
const usersRouter = require('express').Router()
const User = require("../models/user")

usersRouter.post("/", async (request, response) => {
  const body = request.body
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const users = await User.find({ username: user.username })

  if (!(user.username || body.passwordHash)) {
    return response.status(400).json({
      error: 'Username and password are required'
    })
  }

  if (users.length !== 0) {
    return response.status(400).json({
      error: 'this user has already been added'
    })
  }

  const savedUser = await user.save()

  response.json(savedUser)

})

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs")
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter
