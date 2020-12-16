import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { useContacts } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'

export default function NewConversationModal({ closeModal }) {
    const { contacts } = useContacts()
    const { createConversation } = useConversations()
    const [selectedContactsIds, setSelectedContactsIds] = useState([])

    function handleCheckBoxSelect(contactId) {
        setSelectedContactsIds(prevSelectedIds => {
            if (prevSelectedIds.includes(contactId)) {
                return prevSelectedIds.filter(prevId => prevId !== contactId)
            } else {
                return [...prevSelectedIds, contactId]
            }
        })
    }

    function handleSubmit(e) {
        e.preventDefault()
        
        createConversation(selectedContactsIds)
        closeModal()
    }


    return (
        <>
            <Modal.Header closeButton>Create Contact</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    {contacts.map(contact => (
                        <Form.Group key={contact.id} controlId={contact.id}>
                            <Form.Check
                                type="checkbox"
                                value={selectedContactsIds.includes(contact.id)}
                                label={contact.name}
                                onChange={() => handleCheckBoxSelect(contact.id)}
                            />
                        </Form.Group>
                    ))}
                    <Button type="submit">Create</Button>
                </Form>
            </Modal.Body>
        </>
    )
}
