class ErrorHandler extends Error {
  constructor(message, statusCode, data = null) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  console.log(err);

  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.name === "JsonWebTokenError") {
    err.message = "JSON Web Token is invalid. Try again!";
    err.statusCode = 400;
  }

  if (err.name === "TokenExpiredError") {
    err.message = "JSON Web Token is expired. Try again!";
    err.statusCode = 400;
  }
  if (err.name === "CastError") {
    err.message = `Resource not found. Invalid: ${err.path}`;
    err.statusCode = 400;
  }
  const errorMessage = err.data
    ? Object.values(err.data)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
    data: err.data || null,
  });
};

export default ErrorHandler;
