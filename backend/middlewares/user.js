// 사용자 locals
const userAuth = (req, res, next) => {
  const user = req.session.user;
  const isAuth = req.session.isAuthenticated;

  if (!user || !isAuth) {
    return next();
  }
  next();
};

module.exports = userAuth;
