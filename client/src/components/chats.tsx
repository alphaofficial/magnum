import { FC, Fragment, useEffect, useState } from "react"
import {animateScroll} from 'react-scroll'
import { useMessagesBetweenTwoEntitiesQuery, usePostMessageMutation, MessagesBetweenTwoEntitiesDocument, MessagesBetweenTwoEntitiesQuery } from "../generated/graphql"
import Picker, { SKIN_TONE_MEDIUM_DARK, IEmojiData } from 'emoji-picker-react';
import {FiSmile} from 'react-icons/fi'

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
        <div style={{maxHeight: '80vh', minHeight: '80vh', overflowY: 'auto'}} id="chatbox" className="hide-scroll">
            
            {destinationUser.length > 0 &&
            <Fragment>
             {messages.messagesBetweenTwoEntities?.map((message) => (
                <div key={(message.createdAt || Date.now().toString()) + Math.random() * Date.now()} style={{
                display: 'flex', 
                justifyContent: currentUser === message.origin_user ? 'flex-end' : 'flex-start', 
                paddingBottom: '1em', 
                }}>
                    <div style={{
                        background: currentUser === message.origin_user ? "#F7F4F0" : "#1F1F1F", 
                        color: currentUser === message.origin_user ? "#1F1F1F" : "white", 
                        padding: '.5em',
                        borderTopRightRadius:'.5em', 
                        borderTopLeftRadius:  '.5em', 
                        borderBottomRightRadius: currentUser === message.origin_user ? undefined : '.5em', 
                        borderBottomLeftRadius: currentUser === message.origin_user ? '.5em' : undefined, 
                        maxWidth: '60%'
                    }}>
                        {message.content}
                    </div>
                </div>
            ))}
            </Fragment>
            }
            
        </div>
    )
}

export const Chats: FC<IChatProps> = ({currentUser, destinationUser}) => {

    const [content, setContent] = useState("")
    const {subscribeToMore, data, error} = useMessagesBetweenTwoEntitiesQuery({variables: {from: currentUser, to: destinationUser}})
    const [PostMessage] = usePostMessageMutation()
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState<IEmojiData | undefined>();

    const onEmojiClick = (event: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => {
        console.log(chosenEmoji)
        console.log(event)
        console.log(data)
        setChosenEmoji(data);
        let x = content
        x += data.emoji
        setContent(x)
    };

    const sendMessage = () => {
        console.log(currentUser, content, destinationUser)
        if(content.length > 0){
            PostMessage({
                variables: {from: currentUser, content: content, to: destinationUser}
            })
            setContent("")
            setShowEmojiPicker(false)
        }
    }

    let subscribeToNewChats = () => {
		if (currentUser && destinationUser && subscribeToMore !== undefined) {
			subscribeToMore({
                document: MessagesBetweenTwoEntitiesDocument,
                variables: {from: currentUser, to: destinationUser},
                updateQuery: (MessagesBetweenTwoEntitiesDocument, { subscriptionData }) => {
                    return subscriptionData.data
                }
            })
		}
	}

    useEffect(() => {
        setShowEmojiPicker(false)
    }, [])


    if(error) return null
    else if(!data) {
        return (
            <Fragment>
                <div style={{position: 'fixed', left: '20%', width: '80%'}} className="px-6 pt-4">
                    <div className="min-h-100 w-auto relative">
                        <p>Start a new chat</p>
                    </div>
                </div>
            </Fragment>
        )
    }
    return (
        <div style={{position: 'fixed', left: '20%', width: '80%'}} className="px-6 pt-4">
            <div className="min-h-100 w-auto relative">
                {data && currentUser && destinationUser && subscribeToNewChats !== undefined &&
                    <Fragment>
                        <MessagesComponent currentUser={currentUser} destinationUser={destinationUser} messages={data}subscription={subscribeToNewChats} />
                        <div className="flex flex-row justify-between items-center">
                            <div className='w-full mr-2'>
                                <input onKeyUp={e => {
                                    if(e.key === 'Enter') sendMessage()
                                }} type="text" placeholder="Message"  value={content} className="w-full bg-gray-200 py-2 px-2 rounded-md" onChange={e => setContent(e.target.value)} />
                            </div>
                            {showEmojiPicker && <div style={{position: 'absolute', bottom: '3em', right: 0}}>
                                <Picker onEmojiClick={onEmojiClick}  skinTone={SKIN_TONE_MEDIUM_DARK}/>
                            </div>}
                            <div className="flex flex-row px-2 py-2 mr-2 rounded" style={{backgroundColor: '#F7F4F0'}}>
                                <span className="cursor-pointer" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><FiSmile /></span>
                            </div>
                            <div className="flex flex-row">
                                <img className="cursor-pointer" alt="send" src="/img/send.svg" onClick={sendMessage}/>
                            </div>
                        </div>
                    </Fragment>
                }
                
            </div>
        </div>
    )
}