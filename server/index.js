const path = require('path')
const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const boardsRouter = require('./routes/boards')

const app = express()
const port = process.env.PORT

const buildDirectoryPath = path.join(__dirname, '../build')

app.use(express.static(buildDirectoryPath))

app.use(cors())
app.use(express.json())
app.use(boardsRouter)


app.listen(port, () => {
    console.log(`Server is up on port ${port}.`)
})