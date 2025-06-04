const sortArticlesByDate = (articles) => {
  const articlesCopy = articles.map((article) => article);
  articlesCopy.sort((a, b) => {
    return Number(b.created_at) - Number(a.created_at);
  });
  return articlesCopy;
};

module.exports = sortArticlesByDate;
