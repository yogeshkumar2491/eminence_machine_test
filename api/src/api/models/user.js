const mongoose = require("mongoose"),

    Schema = mongoose.Schema,

    userSchema = new Schema({
        userName: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true,
        },
        ip: {
            type: String
        }
    }, {timestamps: true}),


    User = mongoose.model("User", userSchema);

User.createCollection().then(function (collection) {
    console.log('Collection is created!');
});

module.exports = User;