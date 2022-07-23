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
    console.log('Initializing...')
    console.log(`Listening on port ${port}.`);

});

io.on('connection', async (socket) => {
    socketHandler(socket, io, store)
    // console.log(await db.get('xi_maths_10.3'))
    // return console.log(await db.get('list_alpha'))
    //
    // let list = await db.get('list_alpha');
    // let exercises = await db.list('xi_chem');
    //
    // console.log('Initializing list creation for chem...')
    //
    // for (let i = 0; i < exercises.length; i++) {
    //
    //     let stuff = await db.get(exercises[i]);
    //
    //     list[exercises[i].replace('.', '_')] = {
    //
    //         id: exercises[i],
    //         grade: exercises[i].split('_')[0],
    //         subject: exercises[i].split('_')[1],
    //         name: stuff.name.replace(/\s/g, ""),
    //         images: stuff.normals,
    //         source: stuff.url
    //
    //     }
    // }
    // console.log(list)
    // await db.set('list_alpha', list)


});