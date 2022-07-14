import express from "express";
import http from "http";
import {Server} from "socket.io"
import session from 'express-session';
import bodyParser from 'body-parser'
import path from 'path';

import createRoutes from "./Server/routes.js";
import socketHandler from "./Server/socket-handler.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const dir = path.resolve()
const store = new session.MemoryStore()

app.use(express.static(dir + '/Public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'moshimoshi',
    cookie: {
        maxAge: 1 * 60 * 60 * 1000
    },
    saveUninitialized: false,
    store
}))

createRoutes(app, dir, {store});

const port = 3000;

server.listen(port, async () => {
    console.clear()
    console.log(`Listening on port ${port}.`);
});

io.on('connection', (socket) => {
    socketHandler(socket, io, store)
});