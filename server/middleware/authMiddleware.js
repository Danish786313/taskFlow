const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responsHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : null;

    if (!token) {
        return responseHandler.errorResponseWithoutData(
            res,
            'Access token required. Please sign in.',
            401
        );
    }

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return responseHandler.errorResponseWithoutData(
                res,
                'Invalid or expired session token. Please sign in again.',
                403
            );
        }
        req.user = decodedUser;
        next();
    });
}

function optionalAuthenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7).trim()
        : null;

    if (!token) {
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
        if (!err && decodedUser) {
            req.user = decodedUser;
        }
        next();
    });
}

module.exports = {
    authenticateToken,
    optionalAuthenticateToken
};
