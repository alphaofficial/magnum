import { PubSub } from "graphql-subscriptions";
import { Document } from "mongoose";
import { IMessage } from "types";
import { Message, User } from "../../models";
import pubsub from '../../pubsub'


export const resolvers = {
	Query: {
        messages: async() => {
			const messages = await Message.find({}, (err, messages) => {
				if(err) return []
				
				return messages
			})
			return messages
		},
		messagesByDestinationUser: async(parent: any, {email} : {email: string}) => {
			const messages = await Message.find({destination_user: email}, (err, messages) => {
				if(err) return null
				return messages
			})

			return messages
		},
		messagesBetweenTwoEntities: async(parent: any, {from, to} : {from: string, to: string}) => {
			const messages = await Message.find({origin_user: from, destination_user: to}, (err, messages) => {
				if(err) return null
				return messages
			})
			pubsub.publish('MESSAGES', { messages });
			console.log("Messages between 2 people: ", messages)
			return messages
		},
		message: async (parent: any, {email} : {email: string}) => {
			const message = await Message.find({email: email}, (err, message) => {
				if(err) return err.message
				return message
			})

			return message
		},
		users: async () => {
			const users = await User.find({}, (err, users) => {
				if(err) return err.message
				return users
			})
			return users
		},
		user: async (parent: any, {email} : {email: string}) => {
			const user = await User.find({email: email}, (err, user) => {
				if(err) return err.message
				return user
			})
			return user
		}
    },
	Mutation: {
        postMessage: async (parent: any, args: IMessage) => {
			console.log("received: ", args)
			try {
				const messages = await Message.find({}, (err, messages) => {
					if(err) return []
					return messages
				})
				let newMessage = new Message(args)

				const new_message = await newMessage.save()
				if(new_message){
					pubsub.publish('NEW_MESSAGE', { onMessages: [new_message] });
					return [new_message]
				}
				return []
			} catch (error) {
				console.log(error.message)
				return []
			}
        },
		logUser: async (parent: any, {email, isLoggedIn, picture}: {email:string, isLoggedIn: boolean, picture: string}) => {
			try {
				const users = await User.find({}, (err, users) => {
					if(err) return []
					return users
				})

				const user = await User.find({email: email}, (err, messages) => {
					if(err) return []
					return messages
				})
				
				if(user.length > 0){
					console.log("Here: ")
					const update_user = await User.findOneAndUpdate({email: email}, {isLoggedIn: isLoggedIn}, {new: true}, (err, user) => {
						if(err) return err.message
						if(user) return "User log updated"
						return "nothing happened"
					})

					console.log(update_user)
					pubsub.publish('USER_UPDATE', { onUserUpdate: [update_user] });
					return "Logged"
				}
				else {
					const newUser = new User({email: email, isLoggedIn: isLoggedIn, picture: picture})
					const new_user = await newUser.save()
					if(new_user){
						pubsub.publish('USER_UPDATE', { onUserUpdate: [new_user] });
						return  "Logged"
					}
					return "Not logged"
				}

			} catch (error) {
				console.log(error.message)
				return error.message
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