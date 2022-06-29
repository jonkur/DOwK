require('dotenv').config()
const express = require('express')

const app = express()
const PORT = process.env.PORT || 3000
let pongCounter = 0

app.get('/pingpong', (req,res) => {
    res.send(`pong ${pongCounter}`)
    pongCounter += 1
})

app.listen(PORT, () => {
    console.log(`Ping-pong app running in port ${PORT}`)
})