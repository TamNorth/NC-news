const sortArticlesByDate = (articles) => {
  articles.sort((a, b) => {
    return Number(b.created_at) - Number(a.created_at);
  });
  return articles;
};

module.exports = sortArticlesByDate;
