const server = require('./server')
const port = process.env.PORT || 3000

server.listen(port, (err) => {
  if (err) {
      return console.log(err)
  }
  
  console.log(`server is listening on ${port}`)
})