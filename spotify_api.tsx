export const auth_endpoint = "https://accounts.spotify.com/authorize";
export const redirect_url = "https://https://changeyourmood.vercel.app/authorized";
const CLIENT_ID = "46bf5602e0f949babda734101dc3a3f0";
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

interface TokenObject {
    [key: string]: string;
}

export const get_token_from_url = (): TokenObject => {
    return window.location.hash
        .substring(1)
        .split('&')
        .reduce((initial: TokenObject, item) => {
            let parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
            return initial;
        }, {});
}