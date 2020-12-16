import React from 'react'
import OpenConversation from './OpenConversation'
import Sidebar from './Sidebar'
import { useConversations } from '../contexts/ConversationsProvider'

export default function DashBoard({ id }) {
    const { selectedConversation } = useConversations()
    return (
        <div className="d-flex vh-100">
            <Sidebar id={id} />
            { selectedConversation && <OpenConversation />}
        </div>
    )
}
