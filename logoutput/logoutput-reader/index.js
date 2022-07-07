require('dotenv').config()
const express = require('express')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const axios = require('axios')

const app = express()
const PORT = process.env.PORT || 3000
const logFileName = process.env.FILENAME || 'lo-log.txt'
const currDir = process.env.USE_CURRENT_DIR ? __dirname : ''
const dir = currDir || process.env.DIR || path.join('/', 'usr', 'src', 'app', 'logs')
const logDir = path.join(dir, logFileName)
const pongsUrl = process.env.PONGS_URL || 'http://pingpongapp-svc/numPongs'

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

const getPongsFromHttpEndpoint = async () => {
	try {
		const pongs = await axios.get(pongsUrl)
		console.log(`Got ${pongs} pongs.`)
		return pongs.data
	} catch (err) {
		console.log('Failed getting pongs!')
		console.log(err)
	}
}

app.get('/', async (req, res) => {
	try {
		const lastLogLine = await readLastLogEntry()
		const pongCounter = await getPongsFromHttpEndpoint()
		console.log('Responding with log line: ', lastLogLine, '\nand pingpong count', pongCounter)
		return res.send(`
			<p>${lastLogLine}</p>
			<p>Ping / Pongs: ${pongCounter}</p>
		`)
	} catch (err) {
		console.log(err)
		return res.status(500).send('error processing request')
	}
})

app.listen(PORT, () => {
	console.log(`App running in port ${PORT}`)
})