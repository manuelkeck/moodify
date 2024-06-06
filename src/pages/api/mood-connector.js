import {sendMoodToDB} from "../../app/helper/mood-handler";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({error: "Method not allowed"});
        return;
    }

    const { auth0Sub, currentMood } = req.body

    if (!auth0Sub || !currentMood) {
        res.status(400).json({error: "Bad request"});
        return;
    }

    try {
        await sendMoodToDB(auth0Sub, currentMood);
        res.status(200).json({message: "Mood saved successfully"});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }

    res.status(200).json();
    sendMoodToDB(auth0Sub, currentMood).then(r => console.log(""))
}