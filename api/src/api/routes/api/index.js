const router = require('express').Router(),
    auth = require('../../../auth/auth')
const _helper = require("../../controller/helpers/Helper");

router
    .post('/refreshToken/', async (req, res) => {
        try {
            if (req.cookies?.refreshToken) return auth.refreshJWT(req, res)
            else return _helper.jsonresponse(res, 406, true, 'Unauthorized')

        } catch (e) {
            return _helper.jsonresponse(res, 500, true, e.message)
        }
    })

module.exports = router;