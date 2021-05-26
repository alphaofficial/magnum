import { Document } from "mongoose"

export interface IMessage extends Document {
    origin_user: string
    content: string
    destination_user: string,
    createdAt: string
}

export interface IUser extends Document {
    email: string
    picture: string
    isLoggedIn: boolean
}
