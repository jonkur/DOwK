require('dotenv').config()
const express = require('express')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const app = express()
const currDir = process.env.USE_CURRENT_DIR ? __dirname : ''
const fileName = process.env.FILENAME || 'pongCounter.txt'
const dir = currDir || process.env.DIR || path.join('/', 'usr', 'src', 'app', 'logs')
const counterDir = path.join(dir, fileName)
const PORT = process.env.PORT || 3006
let pongCounter = 0

const getCountFromFile = async () => {
  const readStream = fs.createReadStream(counterDir)
  const reader = readline.createInterface({input: readStream})
  const line = await new Promise((resolve) => {
    reader.on('line', (line) => {
      reader.close()
      resolve(line)
    })
  })
  readStream.close()
  if (!isNaN(line)) {
    pongCounter = parseInt(line)
  }
}

const updateCountInFile = async () => {
  fs.writeFile(counterDir, pongCounter.toString(), () => {
    console.log('Updated counter in file to', pongCounter.toString())
  })
}

fs.access(counterDir, (err) => {
  if (err) {
    fs.mkdirSync(dir, {recursive: true})
    fs.writeFileSync(counterDir, '0')
  } else {
    getCountFromFile()
  }
})

app.get('/pingpong', (req, res) => {
  res.send(`pong ${pongCounter}`)
  pongCounter += 1
  updateCountInFile()
})

app.listen(PORT, () => {
  console.log(`Ping-pong app running in port ${PORT}`)
})