const mongoose = require("mongoose");

const dbConnect = () => {
    const connectionParams = {};
    mongoose.connect(global.config.DB_URL, connectionParams);

    mongoose.connection.on("connected", () => {
        console.log("Connected to database successfully");
    });

    mongoose.connection.on("error", (err) => {
        console.log("Error while connecting to database :" + err);
    });

    mongoose.connection.on("disconnected", () => {
        console.log("Mongodb connection disconnected");
    });
};

module.exports = dbConnect;