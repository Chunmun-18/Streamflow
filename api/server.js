const http = require('http'); //http library used to create server

const app = require('../api/app')

const port= 3000;
const server= http.createServer(app) //creating server & loading application
server.listen(port,()=>{
    console.log(`App is running on port ${port}`)
})