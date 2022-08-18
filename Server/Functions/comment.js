import db from "../database.js";
import util from "../util.js";
import {CommentSchema} from "../builders.js";

export default async function comment (req, res) {

    console.log(req.body)
    const t = new Date()

    let {grade, subject, index, comment} = req.body;
    grade = grade.toLowerCase();
    subject = subject.toLowerCase();
    index = index.toLowerCase();
    if (!req.session.user) return res.redirect(`/notes/${grade}/${subject}/${index}`)

    if (
        subject === 'math' ||
        subject === 'mathematics'
    ) subject = 'maths'

    if (
        subject === 'chemistry'
    ) subject = 'chem'

    try {

        const item = await db.get(`${grade}_${subject}_${index}`);
        const user = await util.checkPerson(req)

        if (!item.comments) item.comments = [];
        if (!user) return res.redirect(`/notes/${grade}/${subject}/${index}`);

        const createdComment = new CommentSchema(user, comment, t.toLocaleString(), `${grade}_${subject}_${index}`.toLowerCase())

        item.comments.push(createdComment)

        await db.set(`${grade}_${subject}_${index}`, item)

        res.redirect(`/notes/${grade}/${subject}/${index}`);

    } catch (e) {
        console.log(e)
        res.redirect(`/notes/${grade}/${subject}/${index}`);
    }
}