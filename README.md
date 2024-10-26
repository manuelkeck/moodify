# Moodify

This project is an interactive web application that explores ways to
adaptive and context-sensitive music recommendations based on situational
or affective factors.
The website was developed to support the theoretical results of a master thesis.

The website can be found here: [https://changeyourmood.vercel.app](https://changeyourmood.vercel.app).

To sum up, there are three options to get adaptive or context-sensitive music recommendations.
First, you can select a 'current mood' and a 'target mood' if you start 'Moodify your Mood' after login
with your Spotify premium account.\
Second, with an unpublished iOS and watchOS app, you can get adaptive music recommendations based on your vital data.
The repo can be found here: [https://github.com/manuelkeck/moodisense](https://github.com/manuelkeck/moodisense).\
Last, with a voice assistant in automotive context, you can speak just anything you want to get context-based 
music recommendations decoded by a LLM (gpt-4o-mini from OpenAI).

## Getting Started

First, open a new terminal and make sure you have installed Node.js and npm by entering these commands:
```bash
node -v
# and
npm -v
```
If the commands cannot be found, download and install Node.js from here: [https://nodejs.org/en](https://nodejs.org/en).

Second, clone or download this repo.

Third, open a new terminal (new session) and locate to the cloned/downloaded moodify folder.
Alternatively, you can use the terminal within your preferred IDE.

Enter the following command to install all needed dependencies and packages:
```bash
npm install
```

After installation is done, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

After login with Spotify, you get redirected to the origin domain.
To avoid this, open file 'env-config.tsx' (moodify root) and switch the comment prefix ('//') from first to second line to enable localhost as redirect domain.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details about deployment.

## Contact
Manuel Keck\
keckmanuel@web.de
