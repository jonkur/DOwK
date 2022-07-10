import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import axios from 'axios';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const parsePortFromArgs = (args: Array<string>): number => {
  return args.length == 2 ? /^-[pP]$/.test(args[0]) && /^\d+$/.test(args[1]) ? parseInt(args[1]) : 0 : 0;
};

const app = express();
const args = process.argv.slice(2);
const PORT = parsePortFromArgs(args) || process.env.PORT || 3001;
//const urlPrefix = process.env.URL_PREFIX || 'API';
const storeDir = process.env.STORE_DIR || path.join('/', 'usr', 'src', 'kwbProjApp', 'files');
const imgPath = path.join(storeDir, 'img.jpg');
const lastFetchDatePath = path.join(storeDir, 'lastFetch.txt');
let lastFetch: Date = new Date('1970-1-1');

interface TodoItem {
  id: string
  content: string
  date: Date
}

const todoStore : TodoItem[] = [];

const createTodo = (todoContent: string): TodoItem => {
  return {
    id: uuidv4(),
    content: todoContent,
    date: new Date()
  };
};

const fetchNewImgIfDayHasChanged = async () => {
  const dayStartMs = new Date(new Date().toISOString().split('T')[0]); // Time at the start of this day
  if (!lastFetch || Date.now() - lastFetch.getTime() > Date.now() - dayStartMs.getTime()) {
    // eslint-disable-next-line
    const res = await axios.get('https://picsum.photos/1200', { responseType: 'arraybuffer' });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    fs.writeFile(imgPath, res.data, (err) => {
      if (err) {
        console.log('error writing image');
      } else {
        console.log('done writing image');
      }
    });
    const lfd = new Date();
    fs.writeFile(lastFetchDatePath, lfd.toISOString(), () => {
      lastFetch = lfd;
      console.log(`Fetch date ${lfd.toISOString()} saved.`);
    });
    console.log('Last image fetch:', lastFetch);
  }
};

// create img cache dir if it does not exist
fs.stat(imgPath, (err, stats) => {
  if (err || !stats) {
    fs.mkdir(storeDir, { recursive: true }, (err) => {
      if (err) {
        console.log('Unable to create a store folder:');
        console.log(err);
      }
    });
  }
});

// Update last fetch time
fs.stat(lastFetchDatePath, (err) => {
  if (!err) {
    const readStream = fs.createReadStream(lastFetchDatePath);
    const reader = readline.createInterface({ input: readStream });
    reader.on('line', (line) => {
      reader.close();
      lastFetch = new Date(line);
    });
  }
});

const logger = (req: any, _res: any, next: () => void) => {
  const time = (new Date().toISOString());
  const method = req.method;
  const url = req.url;
  console.log(`${time}: Method: ${method}, URL: ${url}`);
  next();
};

const stripPathPrefix = (req: any, _res: any, next: () => void) => {
  //  TODO: De-hardcode the API part...
  if (req.url.match(/^\/API\/.*/)) {
    const prefixStrippedUrl = req.url.match(/^(\/API\/)(.*)/)[2];
    req.url = '/' + prefixStrippedUrl;
    console.log(req.url);
  }
  next();
};

app.use(logger);
app.use(stripPathPrefix);
app.use(express.json());
app.use(cors());

app.get('/', (_req, res) => {
  res.send('This route is deprecated for now...');
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/dailyimg', async (_req, res) => {
  await fetchNewImgIfDayHasChanged();
  res.sendFile(imgPath);
});

app.get('/todos', (_req, res) => {
  res.send(todoStore);
});

app.post('/todos', (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.body, 'content')) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const newTodo = createTodo(req.body.content as string);
    todoStore.push(newTodo);
    res.send(newTodo);
  } else {
    res.status(400).send('content field missing');
  }
});

app.listen(PORT, () => {
  console.log(`Dowkproject backend server started in port ${PORT}`);
});