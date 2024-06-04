import {AppProps} from "next/app";
import Layout from "@/app/layout/layout";
import './globals.css'
import React from "react";
import {Auth0Provider} from "@auth0/auth0-react";

export default function App({Component, pageProps }: AppProps) {

    return (
        <Auth0Provider
            domain={"dev-03y6j1c7udzkhr4c.eu.auth0.com"}
            clientId={"RM5F880IICXXrfmZ3VTNOvgPkaVFB26a"}
            authorizationParams={{
                //redirect_uri: "http://localhost:3000/spotify-authorized/user/authorized"
                redirect_uri: "https://changeyourmood.vercel.app/spotify-authorized/user/authorized"
            }}
        >
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </Auth0Provider>

    )
}