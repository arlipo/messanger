import React from 'react';
import Login from './Login'
import DashBoard from './DashBoard'
import useLocalStorage from '../hooks/useLocalStorage';
import { ContactsProvider } from '../contexts/ContactsProvider'
import { ConversationsProvider } from '../contexts/ConversationsProvider'

function App() {
    const [id, setId] = useLocalStorage('id')
    const dashBoard =
        <ContactsProvider>
            <ConversationsProvider id={id}>
                <DashBoard id={id} />
            </ConversationsProvider>
        </ContactsProvider>

    return (
        <>
            {id ? dashBoard : <Login onIdSubmit={setId} />}
        </>
    )

}

export default App;