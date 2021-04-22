import { FC, Fragment } from "react"
import {DividerComponent} from "./divider"

interface IContactProps  {
    user: {email: string, picture: string | undefined}
    selectUser: React.Dispatch<React.SetStateAction<string | null>>
}

export const Contact: FC<IContactProps> = ({user, selectUser}) => {
    console.log(user)
    if(!user) return null
    return (
        <Fragment>
            <div onClick={() => selectUser(user.email)} className="w-full flex flex-row justify-start items-center px-2">
                <img className="rounded-full w-8 h-8 font-semibold mr-2" src={user?.picture} />
                <div>
                    <p className="text-base font-bold">{user.email}</p>
                </div>
            </div>
            <DividerComponent />
        </Fragment>
    )
}

export default Contact