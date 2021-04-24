import { FC, Fragment, useEffect, useState } from "react"
import {useMutation, useQuery} from '@apollo/react-hooks'
import {CREATE_MESSAGE, GET_USER_MESSAGES, GET_USER_MESSAGES_SUB} from '../queries'
import {animateScroll} from 'react-scroll'


interface IChatProps {
    currentUser: string
    destinationUser: string | null
}

interface IMessageComponentProps {
    currentUser: string
    destinationUser: string | null
    messages: IMessageProp[]
    subscription: () => void
}

interface IMessageProp {
    origin_user: string
    content: string
    destination_user: string
    createdAt: string
}

const MessagesComponent: FC<IMessageComponentProps> = ({currentUser, destinationUser, messages, subscription}) => {
    
    const scrollToBottom = () => {
        animateScroll.scrollToBottom({
          containerId: "chatbox"
        });
    } 
    
    useEffect(() => {
        if(subscription !== undefined) subscription()
        scrollToBottom()
    }, [messages, subscription])


    if(!messages) return null

    return (
        <div style={{maxHeight: '90vh', minHeight: '90vh', overflowY: 'auto'}} id="chatbox">
            
            {destinationUser ?
            <Fragment>
            <p>Contact: {destinationUser}</p>
             {messages.map((message: IMessageProp) => (
                <div key={message.createdAt + Math.random() * Date.now()} style={{
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
    const {subscribeToMore, data} = useQuery(GET_USER_MESSAGES, {variables: {from: currentUser, to: destinationUser}})
    const [PostMessage] = useMutation(CREATE_MESSAGE)
    

    const sendMessage = () => {
        console.log(currentUser, content, destinationUser)
        if(content.length > 0){
            PostMessage({
                variables: {from: currentUser, content: content, to: destinationUser}
            })
            setContent("")
        }
    }


    if(!data) return null
    if(!subscribeToMore) return null
    return (
        <div style={{position: 'fixed', left: '20%', width: '80%'}} className="px-6 pt-4">
            <div className="min-h-100 w-auto relative">
                <MessagesComponent currentUser={currentUser} destinationUser={destinationUser} messages={data?.messagesBetweenTwoEntities}
                    subscription={() => {
                            subscribeToMore({
                                document: GET_USER_MESSAGES_SUB,
                                variables: {from: currentUser, to: destinationUser},
                                updateQuery: (prev, { subscriptionData }) => {
                                    //console.log("Previous Data: ", prev)
                                    //console.log("Subs data: ", subscriptionData)
                                    if (!subscriptionData.data.onMessages) return prev;
                                    const newMessage = subscriptionData.data.onMessages[0];
                                    //console.log({messagesBetweenTwoEntities: data.messagesBetweenTwoEntities.concat(newMessage)})
                                    
                                    return {messagesBetweenTwoEntities: data?.messagesBetweenTwoEntities.concat(newMessage)} || {messagesBetweenTwoEntities: [...prev.messagesBetweenTwoEntities.concat(newMessage)]}
                                }
                            })
                        
                    }
                       
                    } />
                <div className="flex flex-row justify-between items-center">
                    <div className='w-full mr-2'>
                        <input onKeyUp={e => {
                            if(e.keyCode === 13) sendMessage()
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