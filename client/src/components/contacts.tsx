import { useQuery } from "@apollo/client"
import { FC, useEffect } from "react"
import { getInitials } from "../lib"
import { GET_USERS } from "../queries"
import { LogoutButton } from "./auth-actions"
import Contact from "./contact"
import {DividerComponent} from "./divider"

type IContactsProps = {
    user: {name: string, email: string, picture: string}
    selectUser: React.Dispatch<React.SetStateAction<string | null>>
    isAuthenticated: boolean
}

export const Contacts: FC<IContactsProps> = ({user, isAuthenticated, selectUser}) => {
    const {data} = useQuery(GET_USERS)

    useEffect(()=> {
        console.log(data)
    }, [data])
    if(!data) return null
    return (
        <div style={{ padding: 0, margin: 0 }}>
        <div className="sidebar flex-initial">
            <div className="sidebar-sticky">
                <div className="w-full flex flex-row justify-between items-center px-2">
                    {user && user?.picture ? <img src={user.picture} className="w-10 h-10 rounded-full mr-4" /> : <span className="rounded-full py-4 px-4 text-center bg-gray-100 font-semibold mr-2">{getInitials(user.name)}</span>}
                    
                    {isAuthenticated && <LogoutButton />}
                </div>  
            </div>
            <DividerComponent />
            {data?.users?.filter((u:any) => u.email !== user.email)?.map((user: any) => (
                <Contact user={user} selectUser={selectUser} />
            ))}
            
        </div>
        </div>
    )
}