const db = require("../connection");
const { convertTimestampToDate, writeInsertStrings } = require("./utils");

const seed = ({
  topicData,
  userData,
  articleData,
  commentData,
  userTopicData,
}) => {
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
      const dataInsertString = writeInsertStrings({
        topics: topicData,
        users: userData,
        articles: convertedArticleData,
      });
      return db.query(
        dataInsertString + `; SELECT title, article_id FROM articles;`
      );
    })
    .then(([{ rows }]) => {
      let articleIdLookup = {};
      for (let article of rows) {
        articleIdLookup[article.title] = article.article_id;
      }
      const preparedCommentData = commentData.map(({ ...commentKeys }) => {
        let commentCopy = { ...commentKeys };
        commentCopy.article_id = articleIdLookup[commentCopy.article_title];
        delete commentCopy.article_title;
        return convertTimestampToDate(commentCopy);
      });
      return db.query(writeInsertStrings({ comments: preparedCommentData }));
    });
};
module.exports = seed;
