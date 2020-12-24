import React, { useCallback, useContext, useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import { useContacts } from './ContactsProvider'
import { useSocket } from './SocketProvider'

const ConversationsContext = React.createContext()

export function useConversations() {
    return useContext(ConversationsContext)
}

export function ConversationsProvider({ children, id }) {
    const [conversations, setConversations] = useLocalStorage('conversations', [])
    const [selectedConversationIndex, setSelectedConversationIndex] = useState(0)
    const { contacts } = useContacts()
    const socket = useSocket()

    function createConversation(recipients) {
        setConversations(prevConversations => {
            return [...prevConversations, { recipients, messages: [] }]
        })
    }

    const addMessageToConversation = useCallback(({ recipients, text, sender }) => {
        setConversations(prevConversations => {
            let madeChanges = false
            const newMessage = { sender, text }
            const newConversations = prevConversations.map(conversation => {
                if (arrayEquality(conversation.recipients, recipients)) {
                    madeChanges = true
                    return { ...conversation, messages: [...conversation.messages, newMessage] }
                } else return conversation
            })
            if (madeChanges) {
                return newConversations
            } else {
                return [...prevConversations, { recipients, messages: [newMessage] }]
            }
        })
    }, [setConversations])

    useEffect(() => {
        if (socket == null) return
        
        socket.on('receive-message', addMessageToConversation)

        return () => socket.off('receive-message')
    }, [socket, addMessageToConversation])

    function sendMessage(recipients, text) {
        console.log("send message")
        socket.emit('send-message', { recipients, text })

        addMessageToConversation({ recipients, text, sender: id })
    }

    const formattedConversations = conversations.map((conversation, index) => {
        const recipients = conversation.recipients.map(recipientId => {
            const contact = contacts.find(contact => contact.id === recipientId)
            const name = (contact && contact.name) || recipientId

            return { id: recipientId, name }
        })

        const selected = selectedConversationIndex === index

        const messages = conversation.messages.map(message => {
            const sender = message.sender
            const contact = contacts.find(contact => contact.id === sender)
            const name = (contact && contact.name) || sender
            const fromMe = id === sender

            return { ...message, fromMe, senderName: name }
        })

        return { ...conversation, recipients, selected, messages }
    })

    const value = {
        sendMessage,
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex],
        createConversation,
        selectConversationIndex: setSelectedConversationIndex
    }


    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    )
}

function arrayEquality(a, b) {
    if (a.lenght !== b.lenght) return false
    else {
        a.sort()
        b.sort()

        return a.every((element, index) => element === b[index])
    }
}
