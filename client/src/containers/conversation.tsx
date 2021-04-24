import { Chats, Contacts, LoginButton } from "../components"
import { useMutation } from '@apollo/react-hooks'
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { LOG_USER } from "../queries";


const Conversation = () => {

    const {error, isAuthenticated, isLoading, user} = useAuth0()
    const [LogUser] = useMutation(LOG_USER)
    const [destinationUser, setDestinationUser] = useState<string | null>(null)

    function log(user: any){
      LogUser({variables: {email: user?.email || "Anonymous", picture: user?.picture || "https://randomuser.me/api/portraits/men/75.jpg", isLoggedIn: true}})
    }
  
    useEffect(() => {
      console.log(user)
      if(user){
        log(user)
      }
    },[user])

    if(error) <div>An error occured</div>
    if(isLoading) <div>Loading ...</div>
    if(isAuthenticated && user) {
        return (
           
                <div className="container">
                    <div className="flex flex-row justify-start gap-y-4">
                        {<Contacts user={user} isAuthenticated={isAuthenticated} selectUser={setDestinationUser} />}
                        <Chats currentUser={user.email} destinationUser={destinationUser}/>
                    </div>
                </div>
        )
    }
    return <div className="container mx-auto text-center py-20"><LoginButton /></div>
}

export default Conversation