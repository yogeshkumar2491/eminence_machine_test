require("dotenv").config()

global.config = {
    LOG_FOLDER: "logs/",
    DB_URL: process.env.DB_URL,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    API_ISSUER: process.env.API_ISSUER,
    API_AUDIENCE: process.env.API_AUDIENCE,
    API_TOKEN_LIFE: process.env.TOKEN_LIFE ? process.env.TOKEN_LIFE : "3600"
}

/**
 * general files/package require
 */
const appMiddleware = require("./api/middleware/commonMiddleware"),
    cluster = require("cluster"),
    express = require("express"),
    cors = require("cors"),
    cookieParser = require('cookie-parser'),
    dbConnect = require("./config/database");

const app = express(),
    numCPUs = process.env.NUM_CPUS || require("os").cpus().length,
    port = process.env.PORT || 3001;

/**
 * Optimize UV Thread Pool Size (default = 4)
 * @type {*|number}
 */
process.env.UV_THREADPOOL_SIZE = numCPUs

/**
 * Start Master and Worker Processes
 */
if (cluster.isMaster) {

    console.log(`Master Process is running (pid: ${process.pid}).`)

    for (let i = 0; i < numCPUs; i++) cluster.fork()

    cluster.on("online", (worker) => console.log(`Worker Process is running (pid: ${worker.process.pid}).`))

    cluster.on("exit", (worker, code, signal) => {
        if (signal) {
            console.log("Worker Process " + worker.process.pid + " was killed by signal: " + signal + ".")
            cluster.fork()
        } else if (code) {
            console.log("Worker Process " + worker.process.pid + " has died with code: " + code + ".")
            cluster.fork()
        }
    })

} else {
    dbConnect(); // database connection initialization
    app.use(cors())
    app.use(express.json())
    app.use(cookieParser())
    app.use(express.urlencoded({extended: true}))

    // API Routes
    require("./api/routes/route")(app)

    /**
     * middleware functions to add custom headers in api response, handle various exceptions(not found, uncaughtException, etc.)
     */
    process.on('uncaughtException', (err) => console.error("uncaughtException: ", err.stack));

    app.use(appMiddleware)

    /**
     * starting server on given port
     */
    app.listen(port, (err) => {
        if (err) console.log(`Something went wrong!! : ${err.message}`)
        else console.log(`Server running in ${process.env.NODE_ENV} environment.`, '\n', `Starting server on port ${port}.`)
    })
}
