export {}
import {connect, set} from 'mongoose';
const config = require("../../config.json")

set('useNewUrlParser', true);
set('useCreateIndex', true);
set('useFindAndModify', false);
set('useUnifiedTopology', true);
set('debug', true)

export const DB_CONNECT = () => {
    connect(config.MONGO_URI)
    .then(() => {
        console.log("Database connection established!");
    }, (err: Error) => {
        console.log("Error connecting Database instance due to: " + err.message);
    }) 
}
