import { FC } from "react"
import {useQuery, useSubscription} from '@apollo/react-hooks'
import {GET_MESSAGES, GET_USER_MESSAGES} from '../queries'

interface IChatProps {
    currentUser: string
}

interface IMessageProp {
    origin_user: string
    content: string
    destination_user: string
    createdAt: string
}

export const Chats: FC<IChatProps> = ({currentUser}) => {

    const {data} = useQuery(GET_USER_MESSAGES)
   
    if(!data) return null
    return (
        <div style={{position: 'fixed', left: '20%', width: '80%'}} className="px-6 pt-4">
            <div className="min-h-100 w-auto relative">
                <div style={{maxHeight: '90vh', minHeight: '90vh', overflowY: 'auto'}}>
                    {data.messagesBetweenTwoEntities.map((message: IMessageProp) => (
                        <div style={{
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
                    
                </div>
                <div className="flex flex-row justify-between items-center">
                    <div className='w-full mr-2'>
                        <input type="text" placeholder="Message" className="w-full bg-gray-200 py-2 px-2 rounded-md" />
                    </div>
                    <div className="flex flex-row">
                        {/*<img className="mr-2 cursor-pointer" alt="photo" src="/img/image.svg" />
                        <img className="mr-2 cursor-pointer" alt="camera" src="/img/camera.svg" />
                        <img className="mr-2 cursor-pointer" alt="mic" src="/img/mic.svg" />*/}
                        <img className="cursor-pointer" alt="send" src="/img/send.svg" />
                    </div>
                </div>
            </div>
        </div>
    )
}