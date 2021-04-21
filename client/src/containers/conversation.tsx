import { Chats, Contacts, LoginButton } from "../components"
import { useSubscription } from '@apollo/react-hooks'
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { GET_MESSAGES, GET_USERS } from "../queries";


const m = [
    {
      "origin_user": "alphaxsalt@gmail.com",
      "content": "Hello there",
      "destination_user": "baronofficial23@gmail.com",
      "createdAt": "1619016657507"
    },
    {
      "origin_user": "alphaxsalt@gmail.com",
      "content": "Hello there",
      "destination_user": "baronofficial23@gmail.com",
      "createdAt": "1619016657507"
    },
    {
      "origin_user": "alphaxsalt@gmail.com",
      "content": "Hello there",
      "destination_user": "baronofficial23@gmail.com",
      "createdAt": "1618972839667"
    },
    {
      "origin_user": "alphaxsalt@gmail.com",
      "content": "Hello there",
      "destination_user": "baronofficial23@gmail.com",
      "createdAt": "1618972856549"
    },
]
const Conversation = () => {

    const {error, isAuthenticated, isLoading, user} = useAuth0()
    const users = useSubscription(GET_USERS)
  
    if(error) <div>An error occured</div>
    if(isLoading) <div>Loading ...</div>
    if(isAuthenticated) {
        return (
           
                <div className="container">
                    <div className="flex flex-row justify-start gap-y-4">
                        {<Contacts user={user} users={[]} isAuthenticated={isAuthenticated} />}
                        <Chats currentUser={'baronofficial23@gmail.com'} />
                    </div>
                </div>
        )
    }
    return <div className="container mx-auto text-center py-20"><LoginButton /></div>
}

export default Conversation