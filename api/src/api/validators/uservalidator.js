const {check, validationResult} = require('express-validator'),

    /**
     * @name validate functions
     * @type validateRules
     * @description validate input based on given rules.
     */
    userAccountRule = () => {
        return [
            check('id').trim().notEmpty().withMessage('please enter valid userId'),
        ];
    },

    userValidationRule = () => {
        return [
            check('userName').trim().notEmpty().withMessage('please enter valid userName'),
            check('password').trim().notEmpty().withMessage('please enter password').isLength({min: 4}).withMessage('Minimum password length is 4 characters'),
        ];
    },

    /**
     * @name validate
     * @type Middlewrae
     * @description validate Input based on given rules.
     */
    validate = (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) return next();

        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({[err.param]: err.msg}));
        return res.status(422).json({error: true, message: errors.array()[0].msg, data: {}});
    };

module.exports = {
    userAccountRule,
    userValidationRule,
    validate
};