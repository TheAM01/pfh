import db from "../database.js";

export default async function notesApi (req, res) {
    let {grade, subject, index} = req.params;
    grade = grade.toLowerCase();
    subject = subject.toLowerCase();
    index = index.toLowerCase();

    const item = await db.get(`${grade}_${subject}_${index}`);

    if (!item) return res.send({error: true, status: "NOT_FOUND", code: 404});

    res.json(item)
}