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
    // await onload();

});

io.on('connection', async (socket) => {

    socketHandler(socket, io, store)

});

async function onload () {


    const chapter = {
        name: 'chapter 2',
        url: '/notes/xi/chem/2',
        normals: 12,
        subject: 'Chemistry',
        grade: 'XI',
        images: [
            "https://i.ibb.co/hmJS9wT/IMG-20220527-024639-574.jpg",
            "https://i.ibb.co/Pcq6scm/IMG-20220527-024651-823.jpg",
            "https://i.ibb.co/qxKC103/IMG-20220527-024704-246.jpg",
            "https://i.ibb.co/JF5zjnZ/IMG-20220527-024712-841.jpg",
            "https://i.ibb.co/mvNzPJN/IMG-20220527-024720-504.jpg",
            "https://i.ibb.co/dcCTpQs/IMG-20220527-024729-212.jpg",
            "https://i.ibb.co/SJK0fSy/IMG-20220527-024738-147.jpg",
            "https://i.ibb.co/7VctK3f/IMG-20220527-024745-034.jpg",
            "https://i.ibb.co/jGkmF22/IMG-20220527-024753-374.jpg",
            "https://i.ibb.co/hZT7cS9/IMG-20220527-024800-807.jpg",
            "https://i.ibb.co/nD2rqXw/IMG-20220527-024808-794.jpg",
            "https://i.ibb.co/S32WRbc/IMG-20220527-024819-759.jpg"
        ]
    };

    await db.set('xi_chem_2', chapter);
    console.log(await db.get('xi_chem_2'))


    // let chem = await db.list('xi_chem');
    // chem.forEach(async item => {
    //     console.log([item, await db.get(item)])
    // })
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