import React from "react";

function Page() {
    return (
        <div className="p-6 flex-col justify-center lg:w-2/3 text-justify">
            <p className="text-2xl font-light">About</p>
            <br/>
            <p className="text-xs">🚀 Current version: v1.65.1 - Published at 23rd March 2024</p>
            <br/>
            <p className="font-bold mt-10">
                General
            </p>
            <br/>
            <p>
                This website is developed for research purposes.
                The main objective of this website is to validate attributes to reach a mood transformation based on
                the selected moods. The data, including top artists, top tracks and recommendations are provided by
                Spotify Web API. The documentation can be found <a target="_blank"
                                                                   href="https://developer.spotify.com/documentation/web-api">
                <u>here</u></a>.<br/>
                You can give feedback to the presented recommendations. By clicking on yes or no, the response will be
                stored in a database and can be evaluated, once a meaningful amount of responses could be collected.
                Over the time, the attributes for mood-based recommendations will be adjusted to provide more precise
                recommendations. The submitted response contains a timestamp, the selected current mood, the target mood,
                as well as the recommendation URL sent to Spotify&lsquo;s recommendation endpoint and the given answer, if
                the recommendation helps transforming the mood (yes or no). Based on that information the adjustments
                will be performed.
            </p>
            <br/>
            <p className="font-bold mt-10">
                Privacy
            </p>
            <br/>
            <p>
                No personal information is stored. You sign in with your Spotify Premium credentials to get an access
                token from Spotify for your logged in instance. This access token allows you to retrieve data from
                Spotify based on your user profile. You can disable all permissions granted to this site in your
                Spotify account settings.
            </p>
            <br/>
            <p className="font-bold mt-10">
                Security
            </p>
            <br/>
            <p>


            </p>
            <p>
                There is no investigation of additional security on this website. For login, the authorization flow
                from Spotify is implemented which can be found <a target="_blank"
                                                                  href="https://developer.spotify.com/documentation/web-api/concepts/authorization">
                <u>here</u></a>.
            </p>
            <br/>
            <p className="font-bold mt-10">
                Used assets
            </p>
            <br/>
            <p> The <a target="_blank" href="https://icons8.com/icon/99266/arrow"><u>Arrow</u></a> icon on the mood
                selection
                page is used from <a target="_blank" href="https://icons8.com"><u>Icons8</u></a>. The emoticons to
                visualize the corresponding mood are used from <a target="_blank"
                                                                  href="https://emojipedia.org/de/apple"><u>Emojipedia</u></a>.
            </p>
            <br/>
            <p className="font-bold mt-10">
                Contact
            </p>
            <br/>
            <p>
                Manuel Keck<br/>
                <a href="mailto:manuel.keck@student.reutlingen-university.de"><u>manuel.keck@student.reutlingen-university.de</u></a>
            </p>
        </div>
    )
}

export default Page