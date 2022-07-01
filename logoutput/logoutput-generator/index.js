require('dotenv').config()
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')

const fileName = process.env.FILENAME || 'lo-log.txt'
const currDir = process.env.USE_CURRENT_DIR ? __dirname : ''
const dir = currDir || process.env.DIR || path.join('/', 'usr', 'src', 'app', 'logs')
const logDir = path.join(dir, fileName)

str = uuid.v4()

const storeLogLine = (logLine) => {
	fs.appendFile(logDir, logLine + '\n', (err) => {
		if (err) {
			console.log('Error writing to file:')
			console.log(err)
			return
		}
		console.log(`Log written to file: ${logDir}`)
	})
}

const addLogLine = () => {
	const tzoffset = (new Date()).getTimezoneOffset() * 60 * 1000
	const line = (new Date(Date.now() - tzoffset)).toISOString() + ': ' + str
	storeLogLine(line)
	console.log(line)
}

console.log(`Logoutput generator started...`)

fs.access(logDir, (err) => {
	if (!err) fs.unlinkSync(logDir)
	fs.mkdirSync(dir, {recursive: true})
	addLogLine()
})
setInterval(() => {
	addLogLine()
}, 5000);
