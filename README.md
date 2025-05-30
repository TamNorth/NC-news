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

<!--
TABLE COLUMNS BY TABLE
topics         |users          |articles           |comments       |user_topic       |
---------------+---------------+-------------------+---------------+-----------------+
description |  |username    |>B|article_id      |>C|comment_id  |  |user_topic_id |  |
  VC(200)   |  |  VC(40) PK |  |  SE PK         |  |  SE PK     |  |  SE PK       |  |
slug        |>A|name        |  |title           |  |article_id  |<C|username      |<B|
  VC(20) PK |  |  VC(40)    |  |  VC(200)       |  |  INT       |  |  VC(40)      |  |
img_url     |  |avatar_url  |  |topic           |<A|body        |  |topic         |<A|
  VC(1000)  |  |  VC(1000)  |  |  VC(20)        |  |  TEXT      |  |  VC(20)      |  |
            |  |            |  |author          |<B|votes       |  |              |  |
            |  |            |  |  VC(40)        |  |  INT DF:0  |  |              |  |
            |  |            |  |body            |  |author      |<B|              |  |
            |  |            |  |  TEXT          |  |  VC(40)    |  |              |  |
            |  |            |  |created_at      |  |created_at  |  |              |  |
            |  |            |  |  TS DF:CTS     |  |  TS DF:CTS |  |              |  |
            |  |            |  |votes           |  |            |  |              |  |
            |  |            |  |  INT DF:0      |  |            |  |              |  |
            |  |            |  |article_img_url |  |            |  |              |  |
            |  |            |  |  VC(1000)      |  |            |  |              |  |

KEY TO SQL ABBREVIATIONS
---+---------------++-----+-----------------
>A | Reference out || PK  | PRIMARY KEY
<A | Reference in  || CTS | CURRENT_TIMESAMP
VC | VARCHAR       || NN  | NOT NULL
SE | SERIAL        || DF: | DEFAULT

-->
