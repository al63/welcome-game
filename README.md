# Welcome To Your Perfect Home

A web implementation of the Welcome To... board game. Built with Next.js with data stored in Mongodb. Hosted online [here](https://welcome-to-your-perfect-home.vercel.app).

The base game is fully implemented. It would be nice to one day add the advanced city plans, roundabouts, and support for expert rules.


### To run locally
- `npm install`
- add `MONGODB_URI=<MongoDB URI here>` to a `.env.local` file at project root
- `npm run dev`

### How it works
- Game state (what turn it is, what cards are drawn, etc.) and Player state (player board, name, etc.) are stored in MongoDB.
- The app [queries](https://github.com/al63/welcome-game/blob/main/app/api/game/getGame.ts) game/player state on game load, and stores them in a [reducer](https://github.com/al63/welcome-game/blob/main/app/game/%5Bslug%5D/GameStateMachineReducer.tsx) which is accessed throughout the app via [React context](https://github.com/al63/welcome-game/blob/main/app/game/%5Bslug%5D/GameStateMachineContext.tsx).
- Client manages state transitions and enforces legal moves by the player. It then [submits](https://github.com/al63/welcome-game/blob/main/app/api/turn/route.ts) that to the API. The API trusts that the client is a good actor, because who would cheat in a friendly board game :)
- Client [polls](https://github.com/al63/welcome-game/blob/main/app/api/poll/route.ts) API until every player has finished the current turn. Repeat forever until game ends.
