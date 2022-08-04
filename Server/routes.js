import login from "./Functions/login.js";
import writePost from "./Functions/create-post.js";
import register from './Functions/register.js'
import util from './util.js'
import db from "./database.js";
import fs from "fs";


function routes (app, dir, ext) {

    dir += '/Public/'

    app.get('/', (req, res, next) => {
        res.sendFile(dir + 'Static/home.html')
    });

    app.get('/home', (req, res) => {
        res.sendFile(dir + 'Static/home.html')
    });

    app.get('/all', (req, res) => {
        res.sendFile(dir + 'Static/all.html')
    });

    app.get('/contact', (req, res, next) => {
        res.sendFile(dir + 'Static/contact.html');
    });

    app.get('/template', (req, res) => {
        if (req.query.override !== 'true') return res.sendFile(dir + 'Static/not-found.html')
        res.sendFile(dir + 'template.html')
    });


    app.get('/login', (req, res, next) => {
        res.sendFile(dir + 'User/login.html');
    })

    app.get('/register', (req, res) => {
        res.sendFile(dir + 'User/register.html');
    });

    app.get('/profile', (req, res) => {

        if (!util.checkAuth(req, ext.store)) return res.redirect('/login?session_confirmation=true')

        res.sendFile(dir + 'User/profile.html');

        ext.io.on('connection', (socket) => {
            socket.on('load_profile', async () => {
                let data = await util.checkPerson(req);
                ext.io.emit('load_profile', data);
            })
        })
    })

    app.post('/login', async (req, res) => {
        await login(req, res, ext)
    });

    app.post('/register', async (req, res) => {
        await register(req, res);
    });

    app.get('/logout', (req, res) => {

        req.session.destroy((err) => {
            if (err) return res.clearCookie("notcookie", { path: "/" }).send('cleared cookie');
        });
        res.redirect('/')

    });

    app.get('/notes/:grade/:subject/:index', async (req, res) => {

        let {grade, subject, index} = req.params;
        grade = grade.toLowerCase();
        subject = subject.toLowerCase();
        index = index.toLowerCase();

        const item = await db.get(`${grade}_${subject}_${index}`);

        if (!item) return res.sendFile(dir + 'Static/not-found.html');

        res.sendFile(dir + 'Dynamic/post-template.html')

    });

    app.get('/api/:grade/:subject/:index', async (req, res) => {

        let {grade, subject, index} = req.params;
        grade = grade.toLowerCase();
        subject = subject.toLowerCase();
        index = index.toLowerCase();

        const item = await db.get(`${grade}_${subject}_${index}`);

        if (!item) return res.send({error: true, status: "NOT_FOUND", code: 404});

        res.json(item)

    });

    app.get('/cdn/:file', (req, res) => {

        const path = `${dir}Assets/${req.params.file}`
        if (fs.existsSync(path)) {
            return res.sendFile(path)
        }
        res.sendStatus(404);

    })

    app.get('/db/:query', async (req, res) => {
        const item = await db.get(req.params.query)
        res.json(item);
        console.log(item);
    })

    app.use((req, res) => {
        res.status(404);
        res.sendFile(dir + 'Static/not-found.html')
    });

}

export default routes