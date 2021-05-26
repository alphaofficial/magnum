import { FC, Fragment, useEffect, useState } from "react"
import {animateScroll} from 'react-scroll'
import { useMessagesBetweenTwoEntitiesQuery, usePostMessageMutation, MessagesBetweenTwoEntitiesDocument, MessagesBetweenTwoEntitiesQuery } from "../generated/graphql"


interface IChatProps {
    currentUser: string
    destinationUser: string
}

interface IMessageComponentProps {
    currentUser: string
    destinationUser: string
    messages: MessagesBetweenTwoEntitiesQuery
    subscription: () => void
}

const MessagesComponent: FC<IMessageComponentProps> = ({currentUser, destinationUser, messages, subscription}) => {
    
    const scrollToBottom = () => {
        animateScroll.scrollToBottom({
          containerId: "chatbox"
        });
    } 
    
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        subscription()
    }, [subscription])


    if(!messages) return null

    return (
        <div style={{maxHeight: '90vh', minHeight: '90vh', overflowY: 'auto'}} id="chatbox">
            
            {destinationUser.length > 0 ?
            <Fragment>
            <p>Contact: {destinationUser}</p>
             {messages.messagesBetweenTwoEntities?.map((message) => (
                <div key={(message.createdAt || Date.now().toString()) + Math.random() * Date.now()} style={{
                display: 'flex', 
                justifyContent: currentUser === message.origin_user ? 'flex-end' : 'flex-start', 
                paddingBottom: '1em', 
                }}>
                    <div style={{
                        background: currentUser === message.origin_user ? "#58bf56" : "#e5e6ea", 
                        color: currentUser === message.origin_user ? "white" : "black", 
                        padding: '1em',
                        borderRadius: '1em', 
                        maxWidth: '60%'
                    }}>
                        {message.content}
                    </div>
                </div>
            ))}
            </Fragment>

            :

            <p className="mx-auto">Start a chat</p>
            }
            
        </div>
    )
}

export const Chats: FC<IChatProps> = ({currentUser, destinationUser}) => {

    const [content, setContent] = useState("")
    const {subscribeToMore, data, error} = useMessagesBetweenTwoEntitiesQuery({variables: {from: currentUser, to: destinationUser}})
    const [PostMessage] = usePostMessageMutation()
    

    const sendMessage = () => {
        console.log(currentUser, content, destinationUser)
        if(content.length > 0){
            PostMessage({
                variables: {from: currentUser, content: content, to: destinationUser}
            })
            setContent("")
        }
    }

    const subscribeToNewChats = () => {
		if (subscribeToMore) {
			subscribeToMore({
                document: MessagesBetweenTwoEntitiesDocument,
                variables: {from: currentUser, to: destinationUser},
                updateQuery: (MessagesBetweenTwoEntitiesDocument, { subscriptionData }) => {
                    console.log({MessagesBetweenTwoEntitiesDocument})
                    return subscriptionData.data
                }
            })
		}
	}


    if(!data) return null
    else if(error) return null
    return (
        <div style={{position: 'fixed', left: '20%', width: '80%'}} className="px-6 pt-4">
            <div className="min-h-100 w-auto relative">
                <MessagesComponent currentUser={currentUser} destinationUser={destinationUser} messages={data}
                    subscription={subscribeToNewChats} />
                <div className="flex flex-row justify-between items-center">
                    <div className='w-full mr-2'>
                        <input onKeyUp={e => {
                            if(e.key === 'Enter') sendMessage()
                        }} type="text" placeholder="Message"  value={content} className="w-full bg-gray-200 py-2 px-2 rounded-md" onChange={e => setContent(e.target.value)} />
                    </div>
                    <div className="flex flex-row">
                        <img className="cursor-pointer" alt="send" src="/img/send.svg" onClick={sendMessage}/>
                    </div>
                </div>
            </div>
        </div>
    )
}