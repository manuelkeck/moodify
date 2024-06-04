import {sendMoodToDB} from "../../app/helper/mood-handler";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return
    }

    const { auth0Sub, currentMood } = req.body

    res.status(200).json();
    sendMoodToDB(auth0Sub, currentMood).then(r => console.log(""))
}