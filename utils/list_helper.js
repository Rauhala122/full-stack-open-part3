const palindrome = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  const bloglikes = blogs.map(blog => blog.likes)

  return blogs.length === 0 ? 0 :
   bloglikes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const bloglikes = blogs.map(blog => blog.likes)
  const likesmax = Math.max(...bloglikes)

  const favoriteBlog = blogs[bloglikes.indexOf(likesmax)]
  console.log("Blog with the most likes ", favoriteBlog)
  return favoriteBlog
}

const mostBlogs = (blogs) => {

  let authorsArr = []

  const authors = blogs.map(blog => {
    return blog.author
  })
  console.log("authors ", authors)

  const authorUnique = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const uniqueAuthors = authors.filter(authorUnique)

  const numberOfBlogsForAuthor = (selectedAuthor) => {
    return authors.filter(author => author === selectedAuthor).length
  }

  uniqueAuthors.forEach(author => {
    authorsArr.push({author: author, blogs: numberOfBlogsForAuthor(author)})
  })

  const authorBlogs = authorsArr.map(author => author.blogs)
  const blogsMax = Math.max(...authorBlogs)

  const mostBlogs = authorsArr[authorBlogs.indexOf(blogsMax)]
  console.log("Author with the most blogs ", mostBlogs)
  return mostBlogs
}

const dummy = (blogs) => {
  return 1
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  favoriteBlogger
}
