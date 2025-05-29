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
