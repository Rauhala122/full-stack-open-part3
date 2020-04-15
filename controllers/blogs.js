const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
// blogsRouter.get("/", (req, res) => {
//   res.send("<h2>Hello world </h2>")
// })

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs.map(blog => blog.toJSON()))
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  try {
    const savedBlog = await blog.save()
    response.json(savedBlog.toJSON())
  } catch(exception) {

  }
})

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  response.json(blog.toJSON())
})

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body

  console.log(body)

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogsRouter
