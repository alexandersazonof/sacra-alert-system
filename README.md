### README

# Alert System

## Overview
This project is an alert system for monitoring subgraph and RPC endpoints. It uses TypeScript, Node.js, and TypeORM to interact with a PostgreSQL database and schedule tasks.

## Prerequisites
- Node.js
- Yarn
- PostgreSQL

## Installation

1. **Clone the repository:**
   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```sh
   yarn install
   ```

3. **Create `.env` file:**
   Copy the contents of `.env.pub` to a new file named `.env` and fill in the required values.
   ```sh
   cp .env.pub .env
   ```

4. **Configure the database:**
   Ensure your PostgreSQL database is running and the credentials in the `.env` file are correct.

## Configuration

### .env File
The `.env` file should contain the following environment variables:
```dotenv
TELEGRAM_BOT_TOKEN=<your-telegram-bot-token>
TELEGRAM_CHAT_ID=<your-telegram-chat-id>

# rpc data
RPC_TARGET=https://real.drpc.org/,https://fantom.drpc.org
RPC_SOURCE=https://real.drpc.org/,https://fantom.drpc.org
RPC_NAME=Real RPC,Fantom RPC

# subgraph data
SUBGRAPH_TARGET=https://graph.tetu.io/subgraphs/name/sacra-real,https://node.sacrasubgraphftm41.zeeve.io/ac0949db073e065c7a5b66e4d702f814d61cc19b92d04186/query/subgraphs/name/sacra,https://graph.tetu.io/subgraphs/name/sacra-fantom,https://api.goldsky.com/api/public/project_cm0fgwl4gw8dm01tw09dv7vvo/subgraphs/sacra-real/prod/gn
SUBGRAPH_SOURCE=https://real.drpc.org/,https://fantom.drpc.org,https://fantom.drpc.org,https://real.drpc.org/
SUBGRAPH_NAME=Real on our machine subgraph,Fantom Zeeve subgraph,Fantom on our machine,Goldsky real Subgraph

# proxy subgraph
PROXY_SUBGRAPH_TARGET=https://graph-proxy-fantom.sacra.game/,https://graph-proxy-real.sacra.game/
PROXY_SUBGRAPH_NAME=Proxy fantom subgraph,Proxy real subgraph

JOB_INTERVAL=*/1 * * * *

DB_HOST=localhost
DB_USERNAME=user
DB_PASSWORD=password
DB_NAME=mydatabase
```

## Usage

### Development
To start the development server, run:
```sh
yarn dev
```

### Build
To build the project, run:
```sh
yarn build
```

### Start
To start the application, run:
```sh
yarn start
```

## Scripts

- **`yarn build`**: Compiles the TypeScript code.
- **`yarn dev`**: Runs the application in development mode using `ts-node`.
- **`yarn start`**: Builds the project and starts the application.
- **`yarn migration:generate`**: Generates a new migration file.
- **`yarn migration:run`**: Runs the migrations.
- **`yarn migration:revert`**: Reverts the last migration.

## License
This project is licensed under the MIT License.