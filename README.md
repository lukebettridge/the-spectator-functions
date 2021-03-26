# The Spectator Functions

A collection of AWS Lambda functions, managed via the Serverless Framework.

## Getting Started

Follow the steps below to get this project running locally.

### Prerequisites

You'll need the following installed on your machine to run this project:

* Node.js (>= v14.15.0)
* npm (>= v6.14.11)

### Installation

Clone this repository to somewhere on your drive

```
git clone git@github.com:spectator-uk/functions.git
```

Install the dependencies within the root of the project

```
npm i
```

Install the Serverless Framework globally

```
npm i -g serverless
```

Create a file named `.env` at the root of the project, ask a member of the team for the correct values

```
touch .env
```

### Running locally

Execute the following to run a function locally, replacing `<FUNCTION_NAME>` with the name of the function

```
sls invoke local --function <FUNCTION_NAME>
```

## Deployment

To deploy this application, you may need to authenticate Serverless with AWS first

```
sls config credentials --provider aws --key <AWS_KEY> --secret <AWS_SECRET>
```

### Deploying the application

Run the following to deploy the whole Serverless application

```
sls deploy
```

### Deploying a function

Run the following to deploy a single function, replacing `<FUNCTION_NAME>` with the name of the function

```
sls deploy function --function <FUNCTION_NAME>
```

## Functions

### `BuildEconomicsData`

Fetches market data from [IEX Cloud](https://iexcloud.io) based on input from ContentStack. Collates and stores the results as a JSON file hosted in S3 for use on _The Spectator_'s Economics Hub.