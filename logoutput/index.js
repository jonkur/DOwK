require('dotenv').config()
const express = require('express')
const uuid = require('uuid')

const app = express()
const log = []
const logSize = 10
const PORT = process.env.PORT || 3000

str = uuid.v4();

const storeLogLine = (logLine) => {
	log.push(logLine)
	if (log.length > logSize) {
		log.shift()
	}
}

const addLogLine = () => {
	const tzoffset = (new Date()).getTimezoneOffset() * 60 * 1000
	const line = (new Date(Date.now() - tzoffset)).toISOString() + ': ' + str
	storeLogLine(line)
	console.log(line)
}

app.get('/', (req, res) => {
	res.send(log[log.length - 1])
})

app.listen(PORT, () => {
	console.log(`App running in port ${PORT}`)
	addLogLine()
	setInterval(() => {
		addLogLine()
	}, 5000);
})


