//import { v4 as uuidv4 } from 'uuid';
const uuid = require('uuid')

str = uuid.v4();

setInterval(() => {
	console.log(new Date().toISOString() + ': ' + str);
}, 5000);
