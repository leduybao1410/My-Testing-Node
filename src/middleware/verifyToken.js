const jwt = require('jsonwebtoken');

const verifyToken = (getToken) => (req, res, next) => {
    const token = getToken(req);

    if (!token) {
        return res.redirect('/'); // Redirect to login page if no token is provided
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.redirect('/'); // Redirect to login page if the token is invalid
        }
        // Save the decoded username for use in protected routes
        req.username = decoded.username;
        next();
    });
};

const verifyTokenFromCookie = verifyToken((req) => req.cookies.sessionCookie);
const verifyTokenFromHeader = verifyToken((req) => req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null);

module.exports = {
    verifyTokenFromCookie,
    verifyTokenFromHeader
};