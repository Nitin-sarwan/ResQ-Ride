const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true, useUnifiedTopology: true,
        useCreateIndex: true
    }).then((data) => {
        console.log('DB connection successful!');
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = connectDatabase;