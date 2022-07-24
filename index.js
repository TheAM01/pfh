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
    await onload();

});

async function onload () {
    let chem = await db.list('xi_chem');
    const chapter3 = {
        name: 'chapter 3',
        url: '/notes/xi/chem/3',
        normals: 17,
        subject: 'Chemistry',
        grade: 'XI',
        images: [
            'https://i.ibb.co/G9NckYr/IMG-20220609-001249-756.jpg',
            'https://i.imgur.com/FJWE8Do.png',
            'https://i.imgur.com/1z3R8sN.png',
            'https://i.imgur.com/NKwQxOz.png',
            'https://i.imgur.com/hxcaxJ6.png',
            'https://i.imgur.com/0p7qvQO.png',
            'https://i.imgur.com/1CEOuTu.png',
            'https://i.imgur.com/Uljlif5.png',
            'https://i.imgur.com/YJasIJh.png',
            'https://i.imgur.com/Y4VBLkd.png',
            'https://i.imgur.com/OyKkzYO.png',
            'https://i.imgur.com/qv1RSmk.png',
            'https://i.imgur.com/l51BreG.png',
            'https://i.imgur.com/HxIrW25.png',
            'https://i.imgur.com/l7tw673.png',
            'https://i.imgur.com/2aqS3gi.png',
            'https://i.imgur.com/bHVz3Py.png'
        ]
    }
    await db.set('xi_chem_3', chapter3);
    console.log(await db.get('xi_chem_3'))
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
}