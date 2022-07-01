require('dotenv').config()
const express = require('express')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const app = express()
const PORT = process.env.PORT || 3000
const fileName = process.env.FILENAME || 'lo-log.txt'
const currDir = process.env.USE_CURRENT_DIR ? __dirname : ''
const dir = currDir || process.env.DIR || path.join('/', 'usr', 'src', 'app', 'logs')
const logDir = path.join(dir, fileName)

const readLastLogEntry = async () => {
	return new Promise((resolve, reject) => {
		const fileStream = fs.createReadStream(logDir)
		fileStream.on('error', (err) => {
			console.log(err)
			reject('Unable to create a read stream! (Does the file exist?)')
		})
		const rl = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity
		})
		let lastLine = ''
		rl.on('error', (err) => {
			console.log(err)
			reject('Unable to provide log line!')
		})
		rl.on('line', (line) => {
			lastLine = line
		})
		rl.on('close', () => {
			resolve(lastLine)
		})
	})
}

app.get('/', async (req, res) => {
	try {
		const lastLogLine = await readLastLogEntry()
		console.log('Responding with log line: ', lastLogLine)
		return res.send(lastLogLine)
	} catch (err) {
		console.log(err)
		return res.status(500).send('error processing request')
	}
})

app.listen(PORT, () => {
	console.log(`App running in port ${PORT}`)
})