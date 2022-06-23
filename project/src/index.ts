import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
//import path from 'path';

const parsePortFromArgs = (args: Array<string>): number => {
  return args.length == 2 ? /^-[pP]$/.test(args[0]) && /^\d+$/.test(args[1]) ? parseInt(args[1]) : 0 : 0;
};

const app = express();
const args = process.argv.slice(2);
const PORT = parsePortFromArgs(args) || process.env.PORT || 3001;

app.get('/', (_req, res) => {
  res.sendFile(__dirname + '/static/index.html');
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});