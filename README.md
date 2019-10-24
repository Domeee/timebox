# Timebox

Time management does not have to be boring! With the Timebox you can manage the time during workshops intuitively and on all possible devices.

## Technology

- [React](https://reactjs.org/) is used to build the interactive UI.
- [TypeScript](https://www.typescriptlang.org/) is used as programming language.
- [Howler.js](https://howlerjs.com/) is responsible for the smooth audio playback on all devices.
- [Firebase](https://firebase.google.com/) hosts the app.
- [Matomo](https://matomo.org/) keeps track of our visitors.

For a full list of third party libraries see `package.json`.

## Development Prerequisites

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org) (with NPM)

## Development Installation

```sh
git clone git@github.com:Domeee/timebox.git
cd timebox
npm install
npm install -g firebase-tools
```

## Run Development

```sh
npm start
```

Visit your app at [http://localhost:3000](http://localhost:3000).

## Deploy to production

Production build with webpack and deployment to firebase.

```sh
firebase project:list
firebase use [timebox-test-aea15|timebox-innoarchitects-9d7c0]
npm run deploy
```

## Mobile and Browser Testing Sponsor

Unlimited web and mobile app testing is sponsored by [Browserstack](https://www.browserstack.com/). THANKS!

[![Browserstack](https://timebox-test.donhubi.ch/browserstack.png "Browserstack")](https://www.browserstack.com)
