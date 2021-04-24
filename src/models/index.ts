import {model, Schema} from 'mongoose'

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

export const Message = model('Message', messageSchema)
export const User = model('User', userSchema)