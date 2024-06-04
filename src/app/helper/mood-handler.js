export async function sendMoodToDB(auth0Sub, currentMood) {
    const data = {
        auth0Sub: auth0Sub,
        prevMood: "",
        currentMood: currentMood,
        lastUpdate: new Date()
    }

    // await fetch('http://localhost:3000/api/mood', {
    await fetch('https://changeyourmood.vercel.app/api/mood', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
}

export default async function getCurrentMood(auth0Sub) {
    const response =
        // await fetch('http://localhost:3000/api/mood', {
        await fetch('https://changeyourmood.vercel.app/api/mood', {
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
