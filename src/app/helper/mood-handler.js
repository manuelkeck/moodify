import {ENV_URL} from "../../../env-config";

const tmp_url = ENV_URL + "/api/mood"

export async function sendMoodToDB(auth0Sub, currentMood) {
    const data = {
        auth0Sub: auth0Sub,
        prevMood: "",
        currentMood: currentMood,
        lastUpdate: new Date()
    }


    await fetch(tmp_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}

export default async function getCurrentMood(auth0Sub) {
    const response =
        await fetch(tmp_url, {
        method: 'GET',
        headers: {
            'X-Auth0-Sub': auth0Sub
        }
    })
    if (response.status === 404) {
        return false;
    }
    return response.json()
}
