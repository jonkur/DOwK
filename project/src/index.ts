import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import fs from 'fs';
import readline from 'readline';
import axios from 'axios';

const parsePortFromArgs = (args: Array<string>): number => {
  return args.length == 2 ? /^-[pP]$/.test(args[0]) && /^\d+$/.test(args[1]) ? parseInt(args[1]) : 0 : 0;
};
// This entire file is a horrible mess, fix!
const app = express();
const args = process.argv.slice(2);
const PORT = parsePortFromArgs(args) || process.env.PORT || 3001;
const storeDir = process.env.STORE_DIR || path.join('/', 'usr', 'src', 'kwbProjApp', 'files');
const imgPath = path.join(storeDir, 'img.jpg');
const lastFetchDatePath = path.join(storeDir, 'lastFetch.txt');
let lastFetch: Date = new Date('1970-1-1');
let cacheFileChanged = false;

const fetchNewImgIfDayHasChanged = async () => {
  const dayStartMs = new Date(new Date().toISOString().split('T')[0]); // Time at the start of this day
  console.log('lastFetch:', lastFetch);
  if (!lastFetch || Date.now() - lastFetch.getTime() > Date.now() - dayStartMs.getTime()) {
    // eslint-disable-next-line
    //const res = await axios.get('https://picsum.photos/1200', { responseType: 'stream' });
    const res = await axios.get('https://picsum.photos/1200', { responseType: 'arraybuffer' });
    // eslint-disable-next-line
    //await res.data.pipe(fs.createWriteStream(imgPath));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    fs.writeFile(imgPath, res.data, (err) => {
      if (err) {
        console.log('error writing image');
      } else {
        console.log('done writing image');
        updateImgFromCache();
      }
    });
    cacheFileChanged = true;
    const lfd = new Date();
    fs.writeFile(lastFetchDatePath, lfd.toISOString(), () => {
      lastFetch = lfd;
      console.log(`Fetch date ${lfd.toISOString()} saved.`);
    });
  }
};

const updateImgFromCache = () => {
  if (cacheFileChanged) {
    const cachedImage = fs.readFileSync(imgPath);
    fs.writeFile(__dirname + '/static/public/img.jpg', cachedImage, (err) => {
      if (err) {
        console.log(err);
      } else {
        cacheFileChanged = false;
        console.log('Image updated.');
      }
    });
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

app.use(express.static(__dirname + '/static/public'));

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/', async (_req, res) => {
  await fetchNewImgIfDayHasChanged();
  res.sendFile(__dirname + '/static/index.html');
});

app.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});