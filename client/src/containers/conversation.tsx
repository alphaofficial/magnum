import { Chats, Contacts, LoginButton } from "../components"
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useLogUserMutation } from "../generated/graphql";


const Conversation = () => {

    const {error, isAuthenticated, isLoading, user} = useAuth0()
    const [LogUser] = useLogUserMutation()
    const [destinationUser, setDestinationUser] = useState<string>('')

    function log(user: any){
      LogUser({variables: {email: user?.email || "Anonymous", picture: user?.picture || "https://randomuser.me/api/portraits/men/75.jpg", isLoggedIn: true}})
    }
  
    if(user) log(user)

    if(error) <div>An error occured</div>
    else if(user !== undefined) {
        return (
                <div className="container">
                    <div className="flex flex-row justify-start gap-y-4">
                        {<Contacts user={user} isAuthenticated={isAuthenticated} selectUser={setDestinationUser} />}
                        <Chats currentUser={user.email} destinationUser={destinationUser}/>
                    </div>
                </div>
        )
    }
    else if(isLoading) <div>Loading ...</div>
    return <div className="container mx-auto text-center py-20"><LoginButton /></div>
}

export default Conversation