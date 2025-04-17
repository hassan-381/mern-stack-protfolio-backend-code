export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  const cookieExpiresIn = parseInt(process.env.COOKIE_EXPIRES, 10) || 7; // Ensure it's a number, default to 7 days

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
      httpOnly: true,
    })
    .json({
      success: true,
      token,
      message,
      user,
    });
};
