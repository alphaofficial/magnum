
import { FC } from "react"
import { useUsersQuery } from "../generated/graphql"
import Contact from "./contact"
import {DividerComponent} from "./divider"

type IContactsProps = {
    user: {name: string, email: string, picture: string}
    selectUser: React.Dispatch<React.SetStateAction<string>>
    isAuthenticated: boolean
}

export const Contacts: FC<IContactsProps> = ({user, isAuthenticated, selectUser}) => {
    const {data} = useUsersQuery()

    
    if(!data) return null
    return (
        <div style={{ padding: 0, margin: 0 }}>
        <div className="sidebar flex-initial">
            <div className="sidebar-sticky">
                <div className="w-full flex flex-col justify-between items-center px-2">
                    {user && user?.picture && <img src={user.picture} className="mt-2 rounded-full mr-4" alt="user-profile" />}

                    {user && user?.name && <span className="mt-5 rounded-full py-4 px-4 text-center bg-gray-100 font-semibold mr-2">{user.name}</span>}

                </div>  
            </div>

            <div className="px-2 mt-5">Chats</div>
            <DividerComponent />
            {data?.users?.filter((u:any) => u.email !== user.email)?.map((user: any) => (
                <Contact user={user} selectUser={selectUser} />
            ))}
        </div>
        </div>
    )
}