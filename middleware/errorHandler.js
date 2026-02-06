const errorHandler = (err, res) => {
  console.log(err.stack);

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server xatosi",
  });
};

module.exports = errorHandler;
