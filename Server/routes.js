import login from "./Functions/login.js";
import writePost from "./Functions/create-post.js";
import register from './Functions/register.js'
import util from './util.js'
import db from "./database.js";
import fs from "fs";
import {CommentSchema} from "./builders.js";
import comment from "./Functions/comment.js";
import getNotes from "./Functions/get-notes.js";
import notesApi from "./Functions/notes-api.js";
import changePassword from "./Functions/change-password.js";
import forgotPassword from "./Functions/change-password.js";


function routes (app, dir, ext) {

    dir += '/Public/'

    // Static files

    app.get('/test', async (req, res) => {
        console.log(await util.checkPerson(req, ext.store))
        res.send('goy')
    })

    app.get('/', (req, res) => {
        res.sendFile(dir + 'Static/home.html')
    });

    app.get('/home', (req, res) => {
        res.sendFile(dir + 'Static/home.html')
    });

    app.get('/all', (req, res) => {
        res.sendFile(dir + 'Static/all.html')
    });

    app.get('/contact', (req, res) => {
        res.sendFile(dir + 'Static/contact.html');
    });

    app.get('/sources', (req, res) => {
        res.sendFile(dir + 'Static/sources.html')
    })

    app.get('/bot', (req, res) => {
        res.redirect('https://go.theam.ga/pfh/')
    })

    app.get('/template', (req, res) => {
        if (req.query.override !== 'true') return res.sendFile(dir + 'Static/not-found.html')
        res.sendFile(dir + 'template.html')
    });

    // User content

    app.get('/login', (req, res) => {
        res.sendFile(dir + 'User/login.html');
    })

    app.get('/register', (req, res) => {
        res.sendFile(dir + 'User/register.html');
    });

    app.get('/profile', (req, res) => {
        if (!util.checkAuth(req, ext.store)) return res.redirect('/login?session_confirmation=true')
        res.sendFile(dir + 'User/profile.html');
    });

    app.get('/forgot-password', (req, res) => {
        if (!!util.checkAuth(req, ext.store)) return res.redirect('/home');
        res.sendFile(dir + "User/forgot-password.html")
    })

    app.post('/login', async (req, res) => {
        await login(req, res, ext)
    });

    app.post('/register', async (req, res) => {
        await register(req, res);
    });

    app.post('/forgot-password', async (req, res) => {
        await forgotPassword(req, res);
    })

    app.post('/comment', comment)

    app.get('/logout', (req, res) => {

        req.session.destroy((err) => {
            if (err) return res.clearCookie("notcookie", { path: "/" }).send('cleared cookie');
        });
        res.redirect('/')

    });

    // Notes n stuff

    app.get('/notes/:grade/:subject/:index', async (req, res) => {
        return getNotes(req, res, dir)
    });

    app.get('/api/:grade/:subject/:index', notesApi);

    app.get('/cdn/:file', (req, res) => {

        const path = `${dir}Assets/${req.params.file}`
        if (fs.existsSync(path)) {
            return res.sendFile(path)
        }
        res.sendStatus(404);

    });

    app.get('/policy/:category', (req, res) => {

        const path = `${dir}Policies/${req.params.category}.html`
        if (fs.existsSync(path)) {
            return res.sendFile(path)
        }
        return res.sendFile(dir + 'Static/not-found.html');

    })

    app.use((req, res) => {
        res.status(404);
        res.sendFile(dir + 'Static/not-found.html')
    });

}

export default routes