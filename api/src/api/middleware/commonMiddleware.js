module.exports = [

    function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
        next();
    },

    // Catch HTTP 404
    function (req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    },

    // Catch HTTP 500
    function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            error: true,
            message: err.message,
            data: {}
        });
    }
]


