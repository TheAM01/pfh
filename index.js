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
const io = new Server(server, {
    allowRequest: (req, callback) => {
        // with HTTP long-polling, we have access to the HTTP response here, but this is not
        // the case with WebSocket, so we provide a dummy response object
        const fakeRes = {
            getHeader() {
                return [];
            },
            setHeader(key, values) {
                req.cookieHolder = values[0];
            },
            writeHead() {},
        };
        sessionMiddleware(req, fakeRes, () => {
            if (req.session) {
                // trigger the setHeader() above
                fakeRes.writeHead();
                // manually save the session (normally triggered by res.end())
                req.session.save();
            }
            callback(null, true);
        });
    },
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

    let users = await db.get('users');
    users[0].userData.savedUrls = [{title: 'XI Chemistry Chapter 1', url: '/notes/xi/chem/1'}]
    await db.set('users', users)
});

io.engine.on("initial_headers", (headers, req) => {
    if (req.cookieHolder) {
        headers["set-cookie"] = req.cookieHolder;
        delete req.cookieHolder;
    }
});

io.on('connection', async (socket) => {
    socketHandler(socket, io, store)
});

async function onload () {
    const images = [
        "https://i.ibb.co/FXRzf0w/IMG-20220625-015621-261.jpg",
        "https://i.ibb.co/99MmBcX/IMG-20220625-015629-435.jpg",
        "https://i.ibb.co/djpWHrn/IMG-20220625-015637-789.jpg",
        "https://i.ibb.co/8sDd0bM/IMG-20220625-015649-783.jpg",
        "https://i.ibb.co/4J8Vjcq/IMG-20220625-015659-420.jpg",
        "https://i.ibb.co/gmT6chn/IMG-20220625-015710-445.jpg",
        "https://i.ibb.co/W3Cnx7B/IMG-20220625-015718-516.jpg",
        "https://i.ibb.co/6Dz9cxR/IMG-20220625-015730-523.jpg",
        "https://i.ibb.co/wSpzBfT/IMG-20220625-015738-668.jpg",
        "https://i.ibb.co/B6Gnjmb/IMG-20220625-015749-356.jpg",
        "https://i.ibb.co/jzCh5Zv/IMG-20220625-015808-662.jpg",
        "https://i.ibb.co/TW7vL5v/IMG-20220625-015817-693.jpg",
        "https://i.ibb.co/fp8YmfB/IMG-20220625-015824-113.jpg"
    ]


    const chapter = {
        name: 'chapter 10',
        url: '/notes/xi/phys/10',
        normals: images.length,
        subject: 'Physics',
        grade: 'XI',
        images: images
    };

    await db.set('xi_phys_10', chapter);
    console.log(await db.get('xi_phys_10'))


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