import db from "../database.js";

export default async function getNotes (req, res, dir) {
    let {grade, subject, index} = req.params;
    grade = grade.toLowerCase();
    subject = subject.toLowerCase();
    index = index.toLowerCase();

    if (
        subject === 'math' ||
        subject === 'mathematics'
    ) {
        subject = 'maths'
        return res.redirect(`/notes/${grade}/${subject}/${index}`)
    }

    if (
        subject === 'chemistry'
    ) {
        subject = 'chem'
        return res.redirect(`/notes/${grade}/${subject}/${index}`)
    }

    if (
        subject === 'physics' ||
        subject === 'physic'
    ) {
        subject = 'phys'
        return res.redirect(`/notes/${grade}/${subject}/${index}`)
    }

    try {
        const item = await db.get(`${grade}_${subject}_${index}`);

        if (!item) return res.sendFile(dir + 'Static/not-found.html');

        res.sendFile(dir + 'Dynamic/post-template.html')
    } catch (err) {
        console.log(err.toString())
        return res.sendFile(dir + 'Static/error.html');

    }
}