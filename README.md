# CHCollector

CHCollector is a bespoke inventory-management tool, acting as a source of truth for LGS (Local Game Store) inventories that primarily contain cards from the collectible card game, Magic: The Gathering (MTG).

## Motivation

My LGS had been receiving cards through analog means (pencil/paper), and tracking inventory through uncontrolled, unmaintained and legacy solutions, and I chose to help them out by creating something tailored to their business needs.

## Challenges

The project, in its infancy, built upon a very uninformed database collection structure that is currently difficult to migrate. Ultimately, to reproduce the project, it needs to be replicated va tribal knowledge, as much of the backend interactor and controller architecture is deeply intertwined. I hope to encapsulate these soon, which should improve system stability and performance.

There exist legacy patterns between the client and server that I naturally grew out of as my skillset improved, which I occasionally fix from time to time! For example, old sections of the API are not entirely RESTful. Additionally, portions of the directory structure should be carefully extracted and/or renamed to improve readability going forward.

## Major tools used

Client: React, TypeScript, Material-UI, Axios, Formik

API: Node, TypeScript, Express, MongoDB, Winston

## Structure

The repo is monolithic and is separated into several sections:

Client - `frontend/`

API - `monolith/`

Cloud functions - `gc_functions/src/`

Database maintenance scripts - `gc_functions/db_scripts/` (I know, I know, this hierarchy needs fixing)

GitHub Pages build - `docs/`

## API setup

1. Pull down the repo and navigate to `monolith/`
2. Include API keys and env variables at the appropriate levels in the directory structure (contact the repo owner for details)
3. Run `npm install` to install all dependencies
4. Run `npm run test` to ensure tests pass. Interactors (functions that govern touching the persistence layer) are unit-tested against an in-memory MongoDB instance
5. Run `npm run start-dev` to build the TS source and locally serve from `7331`

## Client setup

1. Pull down the repo and navigate to `frontend/`
2. Include API keys and env variables at the appropriate levels in the directory structure (contact the repo owner for details)
3. Run `npm install` to install all dependencies
4. Run `npm test` to run unit tests
5. Run `npm start` to serve the application locally

## Database setup

[Scryfall](https://scryfall.com/), an open-source data provider and MTG search engine, acts as our source of truth for card information and metadata in CHCollector. Thank you, Scryfall team!

1. Obtain a MongoDB Atlas instance, and create a `test` database for local development. CHCollector uses a custom collection structure, so you'll need to replicate that. Contact the repo owner for details
2. Run `npm run update-test-bulk`, which will hit the Scryfall API for its bulk dataset, perform transformation, and bulk-insert the data into the appropriate collection (ETL, basically)

## Deployment

Client - The client is served via GitHub Pages. To create a production build, navigate to `frontend/` and run `npm run build-pages`, which will automatically version bump and recreate the `docs/` directory as appropriate. A PR can be made and merged in from there.

API - The API is hosted on Google Cloud Platform. Navigate to `monolith/`. Then, running `npm run deploy` with an appropriately-formatted `app.yaml` file will deploy the service using the Google Cloud CLI.

## Contributing

Pull requests are welcome, but I suggest that we open an issue first to discuss changes beforehand
