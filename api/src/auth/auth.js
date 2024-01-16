const jwt = require('jsonwebtoken'),
    _helper = require('../api/controller/helpers/Helper')

module.exports = {

    /**
     * @name createJWT
     * @type function
     * @description Retrieve JWT token to Guest Users to access APIs .
     */
    createJWT: createJWT,

    /**
     * @name refreshJWT
     * @type function
     * @description generate new JWT token based on previously generated refresh token.
     */
    refreshJWT: (req, res, user = undefined) => {
        if (!req.cookies?.refreshToken) throw new Error('Unauthorized')
        const {refreshToken} = req.cookies;
        // Verifying refresh token
        jwt.verify(refreshToken, global.config.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) return res.status(406).json({message: 'Unauthorized'});
                else {
                    const {token, refreshToken} = createJWT(req, res, {_id: decoded._id})
                    return res.cookie("refreshToken", refreshToken,
                        {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            maxAge: 24 * 60 * 60 * 1000
                        }).status(200).json({message: 'Token refreshed', token});
                }
            })
    },

    /**
     * @name jwtSecureRoutes for frontend APIs
     * @type Middleware
     * @description Validates Only Authorized User can access the APIs.
     */
    jwtSecureRoutes: (req, res, next) => {
        const authHeader = req.headers?.authorization || req.cookies.token;
        if (authHeader) {
            const token = req.headers?.authorization ? authHeader.split(' ')[1] : authHeader;
            // SIGNING OPTIONS
            const signOptions = {
                issuer: global.config.API_ISSUER,
                subject: 'jwtTokenSecurity',
                audience: global.config.API_AUDIENCE,
            };
            jwt.verify(token, global.config.ACCESS_TOKEN_SECRET, signOptions, async (err, decoded) => {
                if (err) return _helper.jsonresponse(res, 418, true, 'Authentication Failed: ' + err.message)
                next();
            });
        } else {
            _helper.jsonresponse(res, 418, true, 'JWT Token Not Found')
        }
    }
};

function createJWT(req, res, user = undefined) {
    // SIGNING OPTIONS
    const signOptions = {
        issuer: global.config.API_ISSUER,
        subject: 'jwtTokenSecurity',
        audience: global.config.API_AUDIENCE,
        expiresIn: '10m'
    };
    let payload = {
        login: true,
        iat: Math.floor(Date.now() / 1000),
        ...user
    };

    const token = jwt.sign(payload, global.config.ACCESS_TOKEN_SECRET, signOptions),
        refreshToken = jwt.sign(payload, global.config.REFRESH_TOKEN_SECRET, signOptions);
    return {token, refreshToken};
}
