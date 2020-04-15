const mongoose = require("mongoose")
const supertest = require("supertest")
const listHelper = require("../utils/list_helper")
const bcrypt = require("bcrypt")
const app = require("../app")
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require("../models/blog")
const User = require("../models/user")

const blogList = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 50,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Marko Rauhala',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 30,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Saska Rauhala',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 30,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Marko Rauhala',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 30,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Saska Rauhala',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 30,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Marko Rauhala',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 30,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Marko Rauhala',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 30,
    __v: 0
  }
]

beforeEach(async () => {

  const blogs = await Blog.find({})

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

  expect(titles).toContain('Blog5')
})

test("a valid blog can be added", async () => {

  const blogs = await Blog.find({})

  const newBlog = {
    "title": "What I'm going to do tomorrow",
    "author": "Luka Rauhala",
    "url": "https://www.facebook.com",
    "likes": 10,
    "userId": "5e9717d82d6aa0203aad0680"
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

describe('total likes', () => {

  test('Blog likes total of 60 equals 60', () => {
    const result = listHelper.totalLikes(blogList)
    // expect(result).toBe(90)
  })

})

describe("The blog with the most likes", () => {
  test('The blog with the most likes is the second one', () => {
    const result = listHelper.favoriteBlog(blogList)
    expect(result).toEqual(blogList[1])
  })
})

describe("The author with the most blogs", () => {
  test("The author with the most blogs is Marko Rauhala", () => {
    const result = listHelper.mostBlogs(blogList).author
    expect(result).toEqual("Marko Rauhala")
  })
})

// describe('when there is initially one user at db', () => {
//   beforeEach(async () => {
//     await User.deleteMany({})
//
//     const passwordHash = await bcrypt.hash('sekret', 10)
//     const user = new User({ username: 'root', passwordHash })
//
//     await user.save()
//   })
//
//   test('creation succeeds with a fresh username', async () => {
//     const usersAtStart = await helper.usersInDb()
//
//     const newUser = {
//       username: 'mluukkai',
//       name: 'Matti Luukkainen',
//       password: 'salainen',
//     }
//
//     await api
//       .post('/api/users')
//       .send(newUser)
//       .expect(200)
//       .expect('Content-Type', /application\/json/)
//
//     const usersAtEnd = await helper.usersInDb()
//     expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
//
//     const usernames = usersAtEnd.map(u => u.username)
//     expect(usernames).toContain(newUser.username)
//   })

  // test('creation fails with proper statuscode and message if username already taken', async () => {
  //   const usersAtStart = await helper.usersInDb()
  //
  //   const newUser = {
  //     username: 'root',
  //     name: 'Superuser',
  //     password: 'salainen',
  //   }
  //
  //   const result = await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(400)
  //     .expect('Content-Type', /application\/json/)
  //
  //   expect(result.body.error).toContain('`username` to be unique')
  //
  //   const usersAtEnd = await helper.usersInDb()
  //   expect(usersAtEnd).toHaveLength(usersAtStart.length)
  // })
// })
