import sec from "../sec.js";


function login (req, res, ext) {

    console.log(req.body);
    const {username, password} = req.body;

    if (!username || !password) return res.sendStatus(401); //truthy

    if (req.session.authenticated) {

        req.session.user = sec.createHash(username)
        res.json(req.session); // bro is authy;

    } else {

        if (authy(username, password)) {
            req.session.authenticated = true;
            req.session.user = sec.createHash(username)
            res.json(req.session)
        } else {
            res.send('wrong password!')
        }
    }

}

function authy (user, pass) {
    if (user === 'Mueed' && sec.validateHash(pass, '1e427103330a7b55847b497fea27d03d3c9795b30f089468e6f9f26b0181d2ba')) return true;
}

export default login