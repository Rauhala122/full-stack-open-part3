const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const Blog = require("../models/blog")

beforeEach(async () => {

  const blogs = await Blog.find({})
  console.log(blogs)

  const blogObjects = blogs.map(blog => Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

})

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test('All blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  const blogs = await Blog.find({})

  expect(response.body).toHaveLength(blogs.length)
})

test('A specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(titles).toContain('Blog10')
})

test("a valid blog can be added", async () => {

  const blogs = await Blog.find({})

  const newBlog = {
    "title": "Blog5",
    "author": "Luka Rauhala",
    "url": "https://www.facebook.com",
    "likes": 10
  }

  if (newBlog.likes === undefined) {
    newBlog.likes = 0
    expect(newBlog.likes).toBe(0)
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get("/api/blogs")
  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(blogs.length + 1)
  expect(titles).toContain(newBlog.title)
})

test("Blogs have a valid id", async () => {
  const blogs = await Blog.find({})
  blogs.forEach(blog => {
    expect(blog["id"]).toBeDefined()
  })
})

afterAll(() => {
  mongoose.connection.close()
})
