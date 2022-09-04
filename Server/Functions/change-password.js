import util from "../util.js";


async function forgotPassword (req, res, dir) {

    const {email} = req.body;
    if (!email) return res.redirect('/forgot-password?invalid_email=true');

    const user = util.checkPersonByEmail(email);
    if (!user) return res.redirect('/forgot-password?invalid_email=true');

    const encryption = await bcrypt.hashSync(user.username, 10)

    res.redirect('/forgot-password?continue=true');

}

export default forgotPassword