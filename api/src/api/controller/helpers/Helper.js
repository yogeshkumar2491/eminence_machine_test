const bcrypt = require('bcrypt');

class Helper {

    static encryptPassword(password) {
        return bcrypt.hashSync(password, 10, (err, hashPWD) => {
            if (err) return cb(err)
            cb(null, hashPWD);
        });
    }

    static decryptPassword(password, hashPWD) {
        return bcrypt.compareSync(password, hashPWD, (err, isMatch) => {
            if (err) return cb(err)
            cb(null, isMatch);
        });
    }

    static jsonresponse(res, status = 200, error = false, message = '', data = {}) {
        return res.status(status).json({
            error: error,
            message: message,
            data: data
        });
    }

    static getClientIp(req) {
        try {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            if (ip === '::1' || ip === '::ffff:127.0.0.1') return '127.0.0.1'
            return ip
        } catch {
            throw new Error('error while fetching ipAddress')
        }
    }
}

module.exports = Helper;



