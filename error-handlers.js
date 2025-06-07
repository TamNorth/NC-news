exports.handleDatabaseErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request: " + err.message });
    // } else if (err.code === "23503") {
    //   res.status(404).send({ message: "Not found: " + err.message });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status === 404) {
    let message = "Not found";
    if (err.params) {
      message +=
        ": nothing at " +
        Object.keys(err.params) +
        ": " +
        Object.values(err.params);
    }
    res.status(err.status).send({
      message: message,
    });
  } else if (err.status && err.message) {
    res.status(err.status).send({ message: err.message });
  } else {
    console.log(err);
    next(err);
  }
};

exports.handleOtherErrors = (err, req, res, next) => {
  res.status(500).send({ message: "something broke!" });
};
