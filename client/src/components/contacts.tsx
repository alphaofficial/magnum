import { FC } from "react"
import { getInitials } from "../lib"
import { LogoutButton } from "./auth-actions"
import Contact from "./contact"
import {DividerComponent} from "./divider"

type IContactsProps = {
    user: {name: string, email: string, picture: string}
    users: {email: string, picture: string}[]
    isAuthenticated: boolean
}

export const Contacts: FC<IContactsProps> = ({user, isAuthenticated}) => {

    return (
        <div style={{ padding: 0, margin: 0 }}>
        <div className="sidebar flex-initial">
            <div className="sidebar-sticky">
                <div className="w-full flex flex-row justify-between items-center px-2">
                    {user && user?.picture ? <img src={user.picture} className="w-10 h-10 rounded-full mr-4" /> : <span className="rounded-full py-4 px-4 text-center bg-gray-100 font-semibold mr-2">{getInitials(user.name)}</span>}
                    <p className="text-base font-bold">{user.name}</p>
                    {isAuthenticated && <LogoutButton />}
                </div>  
                <div className="flex flex-col items-center text-center mt-4">
                    <div className='w-full px-2'>
                        <input type="text" placeholder="search..." className="w-full bg-gray-200 py-2 px-2 rounded-md" />
                    </div>
                </div>
            </div>
            <DividerComponent />
            <Contact user={user} unread={5} lastMessage={"convert me"} />
        </div>
        </div>
    )
}