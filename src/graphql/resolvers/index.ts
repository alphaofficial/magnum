import { IMessage } from "types";
import { Message, User } from "../../models";
import pubsub from '../../pubsub'


export const resolvers = {
	Query: {
        messages: async() => {
			const messages = await Message.find({})
			return messages
		},
		messagesByDestinationUser: async(parent: any, {email} : {email: string}) => {
			const messages = await Message.find({destination_user: email})
			return messages
		},
		messagesBetweenTwoEntities: async(parent: any, {from, to} : {from: string, to: string}) => {
			const messages = await Message.find({$or:[{origin_user: from}, {destination_user: from}, {origin_user: to}, {destination_user: to}]})
			if(messages) pubsub.publish('MESSAGES', { messages });
			return messages
		},
		message: async (parent: any, {email} : {email: string}) => {
			const message = await Message.findOne({email: email})
			return message
		},
		users: async () => {
			const users = await User.find({})
			return users
		},
		user: async (parent: any, {email} : {email: string}) => {
			const user = await User.findOne({email: email})
			return user
		}
    },
	Mutation: {
        postMessage: async (parent: any, args: IMessage) => {
			//console.log("received: ", args)
			let newMessage = new Message(args)
			const new_message = await newMessage.save()
			if(new_message) pubsub.publish('NEW_MESSAGE', { onMessages: [new_message] });
			return [new_message]
        },
		logUser: async (parent: any, {email, isLoggedIn, picture}: {email:string, isLoggedIn: boolean, picture: string}) => {
			const user = await User.findOneAndUpdate({email: email}, {isLoggedIn: isLoggedIn}, {new: true})
			if(user) {
				return user
			}
			else {
				const newUser = new User({email: email, isLoggedIn: isLoggedIn, picture: picture})
				const new_user = await newUser.save()
				//if(new_user) pubsub.publish('USER_UPDATE', { onUserUpdate: [new_user] });
				return  new_user
			}
			
        }
    },
	Subscription: {
        onMessages: {
            subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE'])
        },
		messages: {
            subscribe: () => pubsub.asyncIterator(['MESSAGES'])
        },
		onUserUpdate: {
            subscribe: () => pubsub.asyncIterator(['USER_UPDATE'])
        }
    }
}