import express from "express";
import http from "http";
import {Server} from "socket.io"
import session from 'express-session';
import bodyParser from 'body-parser'
import path from 'path';

import createRoutes from "./Server/routes.js";
import socketHandler from "./Server/socket-handler.js";
import db from './Server/database.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const dir = path.resolve()
const store = new session.MemoryStore()
const port = process.env.PORT || 3000;
const secret = process.env.SECRET || "moshimoshi69420"
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
const sessionMiddleware = session({
    secret: secret,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    saveUninitialized: false,
    store
});

io.use(wrap(sessionMiddleware));
app.use(express.static(dir + '/Public'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessionMiddleware)

createRoutes(app, dir, {store, io});

server.listen(port, async () => {
    console.clear()
    console.log(`Listening on port ${port}.`);
});

io.on('connection', async (socket) => {
    console.log(await db.list())
    socketHandler(socket, io, store)
});