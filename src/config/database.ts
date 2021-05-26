export {}
import {connect, set} from 'mongoose';
import chalk from 'chalk';

set('useNewUrlParser', true);
set('useCreateIndex', true);
set('useFindAndModify', false);
set('useUnifiedTopology', true);
set('debug', true)

export const DB_CONNECT = () => {
    connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.2qpdm.mongodb.net/im?retryWrites=true&w=majority`)
    .then(() => {
        console.log(chalk.green("✅ Database connection established!"));
    }, err => {
        console.log(chalk.red("❌ Error connecting Database instance due to: " + err));
    }) 

}
