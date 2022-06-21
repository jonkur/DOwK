require('dotenv').config()
const express = require('express')

const app = express()
const args = process.argv.slice(2)
argvPort = args.length == 2 ? /^-[pP]$/.test(args[0]) && /^\d+$/.test(args[1]) ? args[1] : '' : ''
const port = argvPort || process.env.PORT || 3001

app.get('/', (req, res) => {
  res.send('ping')
})

app.listen(port, () => {
  console.log(`Server started in port ${port}`)
})