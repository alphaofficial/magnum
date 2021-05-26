import {Model, model, Schema} from 'mongoose'
import { IMessage, IUser } from 'types';

const messageSchema = new Schema({
    origin_user: {
        type: String
    },
    content: {
        type: String
    },
    destination_user: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const userSchema = new Schema({
    email: {
        type: String
    },
    picture: {
        type: String
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    }
});

export const Message: Model<IMessage> = model('Message', messageSchema)
export const User: Model<IUser> = model('User', userSchema)