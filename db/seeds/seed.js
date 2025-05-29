const db = require("../connection");
const format = require("pg-format");
const { prepareDataForPgFormat, convertTimestampToDate } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(
      `DROP TABLE IF EXISTS comments;
      DROP TABLE IF EXISTS articles;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS topics;
      CREATE TABLE topics (
        description VARCHAR (200), 
        slug VARCHAR(20) PRIMARY KEY, 
        img_url VARCHAR (1000)
      ); 
      CREATE TABLE users (
        username VARCHAR(40) PRIMARY KEY, 
        name VARCHAR (40), 
        avatar_url VARCHAR(1000)
      ); 
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY, 
        title VARCHAR(200), 
        topic VARCHAR(20) REFERENCES topics(slug) ON DELETE CASCADE, 
        author VARCHAR(40) REFERENCES users(username) ON DELETE CASCADE, 
        body TEXT, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        votes INT DEFAULT 0, 
        article_img_url VARCHAR(1000)
      );
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        article_id INT REFERENCES articles(article_id) ON DELETE CASCADE,
        body TEXT,
        votes INT DEFAULT 0, 
        author VARCHAR(40) REFERENCES users(username) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    )
    .then(() => {
      const convertedArticleData = articleData.map((article) => {
        return convertTimestampToDate(article);
      });
      return convertedArticleData;
    })
    .then((convertedArticleData) => {
      return {
        topicData: prepareDataForPgFormat(topicData),
        userData: prepareDataForPgFormat(userData),
        articleData: prepareDataForPgFormat(convertedArticleData),
      };
    })
    .then(({ topicData, userData, articleData, commentData }) => {
      const topicDataInsertStr = format(
        `INSERT INTO topics 
        (description, slug, img_url) 
        VALUES %L;`,
        topicData
      );
      const userDataInsertStr = format(
        `INSERT INTO users 
        (username, name, avatar_url) 
        VALUES %L;`,
        userData
      );
      const articleDataInsertStr = format(
        `INSERT INTO articles 
        (created_at, title, topic, author, body, votes, article_img_url) 
        VALUES %L;`,
        articleData
      );
      return db.query(
        topicDataInsertStr +
          userDataInsertStr +
          articleDataInsertStr +
          `SELECT title, article_id FROM articles`
      );
    })
    .then((queryReturn) => {
      let articleIdLookup = {};
      for (let article of queryReturn[3].rows) {
        articleIdLookup[article.title] = article.article_id;
      }
      const convertedCommentData = commentData.map((comment) => {
        comment.article_id = articleIdLookup[comment.article_title];
        delete comment.article_title;
        return convertTimestampToDate(comment);
      });
      const preparedCommentData = prepareDataForPgFormat(convertedCommentData);
      const commentDataInsertStr = format(
        `INSERT INTO comments 
        (created_at, body, votes, author, article_id) 
        VALUES %L 
        RETURNING *;`,
        preparedCommentData
      );
      return db.query(commentDataInsertStr);
    });
};
module.exports = seed;
