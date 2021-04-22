import {gql} from '@apollo/client'


export const GET_USER = gql`
    query User($email: String){
        user(email: $email) {
            email
            picture
            isLoggedIn
        }
    }
`

export const GET_USERS = gql`
    query {
        users {
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
    subscription MessagesByDestinationUser($email: String) {
        messagesByDestinationUser(email: $email) {
            origin_user
            content
            destination_user
            createdAt
        }
    }
`

export const LOG_USER = gql`
    mutation LogUser($email: String, $picture: String, $isLoggedIn: Boolean){
        logUser(email: $email, picture: $picture, isLoggedIn: $isLoggedIn)
    }
`

export const CREATE_MESSAGE = gql`
    mutation PostMessage($from: String!, $content: String!, $to: String!) {
        postMessage(origin_user: $from, content: $content, destination_user: $to){
            origin_user
            content
            destination_user
            createdAt
        }
    }
`

export const GET_USER_MESSAGES = gql`
    query messagesBetweenTwoEntities($from: String, $to: String) {
        messagesBetweenTwoEntities(from: $from, to: $to) {
            origin_user
            content
            destination_user
            createdAt
        }
    }
`

export const GET_USER_MESSAGES_SUB = gql`
    subscription {
        onMessages {
            origin_user
            content
            destination_user
            createdAt
        }
    }
`