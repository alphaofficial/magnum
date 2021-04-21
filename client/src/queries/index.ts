import {gql} from '@apollo/react-hooks'


export const GET_USER = gql`
    query {
        user(email: String) {
            email
            picture
            isLoggedIn
        }
    }
`

export const GET_USERS = gql`
    query {
        onUserUpdate {
            email
            picture
            isLoggedIn
        }
    }
`

export const GET_MESSAGES = gql`
    subscription {
        onMessages {
            origin_user
            content
            destination_user
            createdAt
        }
    }
`

export const GET_MESSAGES_BY_DESTINATION_USER = gql`
    subscription {
        messagesByDestinationUser(email: String) {
            origin_user
            content
            destination_user
            createdAt
        }
    }
`

export const LOG_USER = gql`
    mutation {
        logUser(email: String, picture: String, isLoggedIn: String)
    }
`

export const CREATE_MESSAGE = gql`
    mutation {
        postMessage(origin_user: String, content: String, destination_user: String)
    }
`

export const GET_USER_MESSAGES = gql`
    query {
        messagesBetweenTwoEntities($from: String!, $to: String!) {
            origin_user
            content
            destination_user
            createdAt
        }
    }
`