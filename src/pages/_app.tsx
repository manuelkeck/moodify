import {AppProps} from "next/app";
import Layout from "@/app/layout/layout";
import './globals.css'
import React from "react";
import {Auth0Provider} from "@auth0/auth0-react";
import {ENV_URL} from "../../env-config";

export default function App({Component, pageProps }: AppProps) {

    return (
        <Auth0Provider
            domain={"dev-03y6j1c7udzkhr4c.eu.auth0.com"}
            clientId={"RM5F880IICXXrfmZ3VTNOvgPkaVFB26a"}
            authorizationParams={{
                redirect_uri: ENV_URL + "/spotify-authorized/user/authorized"
            }}
        >
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Auth0Provider>

    )
}