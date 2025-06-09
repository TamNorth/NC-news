# Introduction

This app provides the backend for a mock news-hosting website api. The api is hosted on Render - go to the /api endpoint [here](https://nc-news-gwte.onrender.com/) to see a list of other endpoints and their descriptions. Below you will find information about setting up the database and the databse structure, so you can play around with the code and run tests. 

# Set-up

The first step is to clone the repo from github:

```bash
git clone https://github.com/TamNorth/NC-news.git
```

Alternatively, if you want to make your own changes, create your own fork form the repo [here](https://github.com/TamNorth/NC-news.git), and make the clone using your own repo's url. 

## Installing dependencies

This app uses Node Package Manager to manage dependencies - which are detailed in package.json and package-lock.json. You will need to have installed [Node](https://nodejs.org/en/download) v.23.11.0 or later and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) v.11.3.0 or later to run this app. 

Install user dependencies by jumping into the directory with your terminal and typing:

```bash
npm install
```

In order to run the testing suite, you will also need jest and supertest, which are dev dependencies. To install these, run the following in your terminal:

```bash
npm install --save-dev jest
npm install --save-dev supertest
```

## NC News Seeding

In order to seed this database for testing and development, you need to create two .env files to point connection.js to the correct database. Connecting to the correct database has been automated in the connection.js and testing files.

- Create a file called <.env.test>, and another called <.env.development>, by pasting the following into the terminal while in the top directory of the repository:

```bash
touch .env.test
touch .env.development
```

- In the test file, paste the following:

```js
PGDATABASE=nc_news_test
```

- In the development file, paste the following:

```js
PGDATABASE=nc_news
```

The testing suite will automatically import the test data and seed it to the test database before each test runs. When you run the testing suite, a confirmation that you are connected to nc_news_test will show up in the console. 

In order to seed the development database, a script has been set up in the package.json. Simply enter your terminal and run:

```bash
npm run seed-dev
```

When you run the script, you should get a message logged to your console confirming that you are connected to nc_news, which will terminate once the seeding is complete. 

# Testing

## The testing suite

Three testing suites are included in the \_\_tests\_\_ directory:

- seed.test.js ensures the seed.js file has properly seeded the database.
- app.test.js tests the app.js and, via integration testing, its subordinate functions in the controllers and models directories. 
- utils.test.js applies unit testing to utility functions in /db/seeds/utils.js - which are the utils for seed.js - and the utils.js file in the top of the directory, which are used by the controller and model files. 

You can run all these files together by typing

```bash
npm run test
```

Alternatively, you can run individual test files by typing a unique part of the file name afterwards, e.g.:

```bash
npm run test app
```

## Accessing server endpoints

You can use a program such as Insomnia to simulate connecting to the development database on your server remotely. The local port is defined in listen.js as 9090, so you will need to connect to localhost:9090/, followed by the api endpoint (see a list of all endpoints at localhost:9090/api).

You can run the application on this port by running the listen.js file, or you can do this via nodemon by typing the following in your console:

```bash
npm run dev
```

Nodemon is a package that will conveniently restart the server when you make changes to the directory, to ensure any updates are visible when you make your next request to the server. 

Test the app by making requests to the server's endpoints (as detailed in endpoints.json or at /api) and comparing these to the data in the db/data/development folder. 

# Entity Relationship Diagram

Below is a representation of the database structure. Note that the server endpoints will provide extra information in some cases, calculated from this data. 

## Table columns and references

topics                  |  |users                   |  |articles                     |  |comments                 |  |user_topic               |  |
:-----------------------|--|:-----------------------|--|:----------------------------|--|:------------------------|--|:------------------------|--|
description<br>*VC(200)*|  |username<br>*VC(40) PK* |>B|article_id<br>*SE PK*        |>C|comment_id<br>*SE PK*    |  |user_topic_id<br>*SE PK* |  |
slug<br>*VC(20) PK*     |>A|name<br>*VC(40)*        |  |title<br>*VC(200)*           |  |article_id<br>*INT*      |<C|username<br>*VC(40)*     |<B|
img_url<br>*VC(1000)*   |  |avatar_url<br>*VC(1000)*|  |topic<br>*VC(20)*            |<A|body<br>*TEXT*           |  |topic<br>*VC(20)*        |<A|
.                       |  |                        |  |author<br>*VC(40)*           |<B|vote<br>*INT DF:0*       |  |                         |  |
.                       |  |                        |  |body<br>*TEXT*               |  |author<br>*VC(40*)       |<B|                         |  |
.                       |  |                        |  |created_at<br>*TS DF:CTS*    |  |created_at<br>*TS DF:CTS*|  |                         |  |
.                       |  |                        |  |votes<br>*INT DF:0*          |  |                         |  |                         |  |
.                       |  |                        |  |article_img_url<br>*VC(1000)*|  |                         |  |                         |  |

## Key to SQL abbreviations

symbol|explanation    |symbol|explanation
-----:|:--------------|-----:|:-----------------
  \>A | Reference out |   PK | PRIMARY KEY
  \<A | Reference in  |  CTS | CURRENT_TIMESTAMP
   VC | VARCHAR       |   NN | NOT NULL
   SE | SERIAL        |  DF: | DEFAULT


