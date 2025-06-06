To do:
- move sortArticlesByDate to utils

# NC News Seeding

In order to seed this database for testing and development, you need to create two .env files that are not included in the github package for security reasons. Follow the instructions below:

- Create a file called <.env.test>, and another called <.env.development>, by pasting the following into the terminal while in the top directory of the repository:

```bash
touch .env.test
touch .env.development
```

- In the test file, paste the following:

```bash
PGDATABASE=nc_news_test
```

- In the development file, paste the following:

```bash
PGDATABASE=nc_news
```

# Entity Relationship Diagram

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


