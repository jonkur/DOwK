This is the backend for the Dowkproject app.

Running in port 3001 by default. To change the port, add the environment variable below:
```
PORT=<desired port number>
```
You can also change the port with passed arguments, like so:
```
npm run start -- -p <port number>
```
The precedence for the port is **passed argument > PORT env variable > default port**.

Start the server with
```
npm run start
```