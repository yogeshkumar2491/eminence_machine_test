const router = require('express').Router(),
    {jwtSecureRoutes} = require('../../../auth/auth'),
    {userAccountRule, userValidationRule, validate} = require('../../validators/uservalidator'),
    userCtrl = require('../../controller/UserController');

router
    .post('/user/login/', userValidationRule(), validate, userCtrl.login)
    .post('/user/register/', userValidationRule(), validate, userCtrl.register)
    .get('/user/:id?/', jwtSecureRoutes, userAccountRule(), validate, userCtrl.accountDetails)

module.exports = router;