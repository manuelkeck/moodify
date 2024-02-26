export const auth_endpoint = "https://accounts.spotify.com/authorize";
export const redirect_url = "http://localhost:3000/authorized";
const CLIENT_ID = "46bf5602e0f949babda734101dc3a3f0";
const CLIENT_SECRET = "a1ed3fbd350e4895b73cb120596aef58";
const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state"
]
export const login_url = `${auth_endpoint}?
client_id=${CLIENT_ID}
&redirect_uri=${redirect_url}
&scope=${scopes.join("%20")}
&response_type=token
&show_dialog=true`

