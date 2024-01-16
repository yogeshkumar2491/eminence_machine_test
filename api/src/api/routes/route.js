//API routes
module.exports = (app) => {

    /**
     * front-end routes
     * @param app
     */
    const apiModules = [
        require("./api/"),
        require("./api/user")
    ]
    app.use("/api", apiModules)
}
