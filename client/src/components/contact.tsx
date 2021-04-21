
import { FC, Fragment } from "react"
import {DividerComponent} from "./divider"

interface IContactProps  {
    user: object
    unread: number
    lastMessage: string
}

export const Contact: FC<IContactProps> = ({user, unread, lastMessage}) => {
  
    return (
        <Fragment>
            <div className="w-full flex flex-row justify-start items-center px-2">
                <span className="rounded-full py-4 px-4 text-center bg-gray-100 font-semibold mr-2">AA</span>
                <div>
                    <p className="text-base font-bold">James</p>
                    <p className="text-xs">My last message ...</p>
                </div>
            </div>
            <DividerComponent />
        </Fragment>
    )
}

export default Contact