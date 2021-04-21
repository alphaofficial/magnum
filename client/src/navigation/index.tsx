import {BrowserRouter as Router, Route} from 'react-router-dom'
import Conversation from '../containers/conversation'

export const Navigation = () => {
    return(
        <Router>
            <Route exact path="/" component={Conversation} />
        </Router>
    )
}