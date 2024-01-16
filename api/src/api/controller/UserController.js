const auth = require('../../auth/auth'),
    _helper = require('./helpers/Helper'),
    userModel = require('../models/user');

class UserController {

    /**
     * @name register
     * @type function(*=, *=): *
     * @description Register New user details in database.
     */
    register = async (req, res) => {
        try {
            const {userName, password} = req.body,
                user = await userModel.exists({userName: userName.trim()});

            if (user) return _helper.jsonresponse(res, 409, true, "The email address you have entered is already registered.")
            let result = await userModel.create({
                userName: userName.trim(),
                password: await _helper.encryptPassword(password), ip: _helper.getClientIp(req)
            });
            console.log(result)
            return _helper.jsonresponse(res, 200, false, "User saved successfully.", result)
        } catch (e) {
            return _helper.jsonresponse(res, 500, true, e.message)
        }
    }

    /**
     * @name login
     * @type post
     * @description Retrieve User details & Issue JWT token if credentials are correct.
     */
    async login(req, res) {
        try {
            let {userName, password} = req.body,
                user = await userModel.findOne({userName})
            if (!user) return _helper.jsonresponse(res, 401, true, "Invalid email address or password.")

            if (!_helper.decryptPassword(password, user.password)) return _helper.jsonresponse(res, 401, true, "Invalid Login credentials.")
            const {token, refreshToken} = auth.createJWT(req, res, {_id: user._id})
            res.cookie("refreshToken", refreshToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 24 * 60 * 60 * 1000
                })
            return _helper.jsonresponse(res, 200, false, "Login successful.", {_id: user._id, userName, token})

        } catch (e) {
            return _helper.jsonresponse(res, 500, true, e.message)
        }
    }

    /**
     * @name login
     * @type post
     * @description Retrieve User details & Issue JWT token if credentials are correct.
     */
    async accountDetails(req, res) {
        try {
            let {id: _id} = req.params,
                user = await userModel.findOne({_id})
            if (!user) return _helper.jsonresponse(res, 401, true, "No record found.")
            return _helper.jsonresponse(res, 200, false, "User details.", user)
        } catch (e) {
            return _helper.jsonresponse(res, 500, true, e.message)
        }
    }
}

module.exports = new UserController();